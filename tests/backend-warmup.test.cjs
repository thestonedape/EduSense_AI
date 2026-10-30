const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Loads the real component with a fake browser: controllable clock, visibility,
// event listeners (deduplicated like the DOM) and a manually fired interval.
function warmup() {
  const clock = { now: 1_000_000 };
  const pings = [];
  const listeners = new Map();
  const intervals = new Map();
  let nextInterval = 1;
  const target = (name) => ({
    addEventListener: (type, fn) => { const key = `${name}:${type}`; if (!listeners.has(key)) listeners.set(key, new Set()); listeners.get(key).add(fn); },
    removeEventListener: (type, fn) => listeners.get(`${name}:${type}`)?.delete(fn),
  });
  const document = { visibilityState: 'visible', ...target('document') };
  const window = {
    ...target('window'),
    setInterval: (fn) => { const id = nextInterval++; intervals.set(id, fn); return id; },
    clearInterval: (id) => intervals.delete(id),
  };
  const FakeDate = class extends Date {};
  FakeDate.now = () => clock.now;
  const context = {
    module: { exports: {} }, exports: {}, document, window, Date: FakeDate,
    process: { env: { NEXT_PUBLIC_API_BASE_URL: 'https://backend.example.test/' } },
    fetch: (url, init) => { pings.push({ url, mode: init.mode, at: clock.now }); return Promise.resolve(); },
    require: (name) => {
      if (name === 'react') return { useEffect: (fn) => { context.__cleanups.push(fn()); } };
      throw new Error(`Unexpected dependency: ${name}`);
    },
    __cleanups: [],
  };
  context.exports = context.module.exports;
  const source = readFileSync(join(__dirname, '../components/backend-warmup.tsx'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, context);
  const mount = () => { context.module.exports.BackendWarmup(); return context.__cleanups.at(-1); };
  const fire = (key) => [...(listeners.get(key) || [])].forEach((fn) => fn());
  const tick = () => [...intervals.values()].forEach((fn) => fn());
  const advance = (ms) => { clock.now += ms; };
  return { mount, fire, tick, advance, pings, listeners, intervals, document };
}

const MIN = 60 * 1000;

test('opening a page pings /health once, without CORS', () => {
  const w = warmup();
  w.mount();
  assert.equal(w.pings.length, 1);
  assert.equal(w.pings[0].url, 'https://backend.example.test/health');
  assert.equal(w.pings[0].mode, 'no-cors');
});

test('client navigations that remount the Navbar do not ping again', () => {
  const w = warmup();
  const unmountLoading = w.mount();
  w.advance(500); w.mount(); unmountLoading();
  w.advance(30 * 1000); w.mount();
  assert.equal(w.pings.length, 1);
});

test('unmounting one instance keeps listeners and the timer for the others', () => {
  const w = warmup();
  const unmountLoading = w.mount();
  const unmountPage = w.mount();
  unmountLoading();
  assert.equal(w.listeners.get('document:visibilitychange').size, 1);
  assert.equal(w.intervals.size, 1);
  unmountPage();
  assert.equal(w.listeners.get('document:visibilitychange').size, 0);
  assert.equal(w.intervals.size, 0);
});

test('returning to the tab after a long absence pings immediately', () => {
  const w = warmup();
  w.mount();
  w.document.visibilityState = 'hidden'; w.fire('document:visibilitychange');
  w.advance(40 * MIN);
  w.document.visibilityState = 'visible'; w.fire('document:visibilitychange');
  assert.equal(w.pings.length, 2);
});

test('an active reader keeps the backend warm every 10 minutes', () => {
  const w = warmup();
  w.mount();
  for (let i = 0; i < 6; i += 1) { w.advance(5 * MIN); w.fire('window:wheel'); w.advance(5 * MIN); w.tick(); }
  assert.equal(w.pings.length, 7);
});

test('an unattended visible tab stops pinging after 20 minutes without input', () => {
  const w = warmup();
  w.mount();
  for (let i = 0; i < 12; i += 1) { w.advance(10 * MIN); w.tick(); } // two hours, no input
  assert.equal(w.pings.length, 2); // load, plus the 10-minute tick inside the window
});

test('hidden tabs never ping on the interval', () => {
  const w = warmup();
  w.mount();
  w.document.visibilityState = 'hidden';
  w.advance(10 * MIN); w.fire('window:keydown'); w.tick();
  assert.equal(w.pings.length, 1);
});
