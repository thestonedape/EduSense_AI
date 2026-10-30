const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Loads the real service factory with a simulated clock, so Render cold starts
// of tens of seconds are replayed instantly.
function servicesWith(get) {
  const clock = { now: 0 };
  const logs = [];
  const FakeDate = class extends Date {};
  FakeDate.now = () => clock.now;
  const context = {
    module: { exports: {} }, exports: {}, crypto: globalThis.crypto,
    Date: FakeDate,
    setTimeout: (fn, ms) => { clock.now += ms; queueMicrotask(fn); return 0; },
    console: { info: (line) => logs.push(JSON.parse(line)), warn: (line) => logs.push(JSON.parse(line)) },
    require: (name) => {
      if (name === 'react') return { cache: (fn) => fn };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  context.exports = context.module.exports;
  const source = readFileSync(join(__dirname, '../lib/api/service-factory.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, context);
  const calls = [];
  const api = { get: async (path, config = {}) => { calls.push({ path, timeout: config.timeout, at: clock.now }); return get(path, config, clock); } };
  return { services: context.module.exports.createServices(api, true), clock, calls, logs };
}

function timeoutError() {
  return Object.assign(new Error('timeout'), { code: 'ECONNABORTED' });
}

// Render holds requests until the instance has booted; an aborted attempt still woke it.
function coldBackend(bootAtMs, data) {
  return async (_path, { timeout }, clock) => {
    if (clock.now + timeout < bootAtMs) { clock.now += timeout; throw timeoutError(); }
    clock.now = Math.max(clock.now, bootAtMs) + 150;
    return { data };
  };
}

test('a measured 44 s Render cold start still opens the page', async () => {
  const { services, clock, calls, logs } = servicesWith(coldBackend(44_000, [{ id: 'cs101', name: 'Data Structures' }]));
  const subjects = await services.getCourses();
  assert.equal(subjects[0].name, 'Data Structures');
  assert.equal(calls.length, 2);
  assert.ok(calls.every((call) => call.timeout <= 25_000));
  assert.ok(clock.now < 46_000, `finished at ${clock.now}`);
  assert.equal(logs.at(-1).event, 'student_read_slow');
});

test('a documented one-minute spin-up is tolerated', async () => {
  const { services, clock } = servicesWith(coldBackend(60_000, { questions: [] }));
  assert.deepEqual(await services.getPracticeQuestions(9), []);
  assert.ok(clock.now <= 70_000);
});

test('a backend that never answers fails within the 70 s deadline, not 180 s or 9 minutes', async () => {
  const { services, clock, calls, logs } = servicesWith(async (_path, { timeout }, c) => { c.now += timeout; throw timeoutError(); });
  await assert.rejects(() => services.getLecture('11111111-1111-1111-1111-111111111111'));
  assert.ok(clock.now <= 70_000, `gave up at ${clock.now}`);
  assert.ok(calls.length >= 3);
  assert.equal(logs.at(-1).event, 'student_read_failed');
});

test('non-transient failures are not retried', async () => {
  const { services, calls } = servicesWith(async () => { throw Object.assign(new Error('refused'), { code: 'ECONNREFUSED' }); });
  await assert.rejects(() => services.getCourse('cs101'));
  assert.equal(calls.length, 1);
});

test('a missing lecture is a 404, not a retry or an error page', async () => {
  const { services, calls, logs } = servicesWith(async () => { throw Object.assign(new Error('nf'), { response: { status: 404 } }); });
  assert.equal(await services.getLecture('22222222-2222-2222-2222-222222222222'), null);
  assert.equal(calls.length, 1);
  assert.equal(logs.length, 0);
});

test('a 503 during a restart is retried and recovers', async () => {
  let failures = 2;
  const { services, calls } = servicesWith(async () => {
    if (failures-- > 0) throw Object.assign(new Error('unavailable'), { response: { status: 503 } });
    return { data: { stats: {}, recent_lectures: [] } };
  });
  const dashboard = await services.getStudentDashboard('student@example.test', false);
  assert.deepEqual(dashboard.recentLectures, []);
  assert.equal(calls.length, 3);
});

test('a backend that keeps answering 503 fails within 15 s instead of holding the page', async () => {
  const { services, clock } = servicesWith(async (_path, _config, c) => { c.now += 50; throw Object.assign(new Error('unavailable'), { response: { status: 503 } }); });
  await assert.rejects(() => services.getCourses());
  assert.ok(clock.now <= 15_000, `gave up at ${clock.now}`);
});

test('warm reads make exactly one request and log nothing', async () => {
  const { services, calls, logs } = servicesWith(async () => ({ data: [] }));
  await services.getCourses();
  assert.equal(calls.length, 1);
  assert.equal(logs.length, 0);
});
