const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { createHmac, webcrypto } = require('node:crypto');
const vm = require('node:vm');
const ts = require('typescript');

function authModule(user, adminEmails = '') {
  const context = {
    module: { exports: {} }, exports: {}, Buffer, crypto: webcrypto,
    TextEncoder, Uint8Array,
    process: { env: { AUTH_SECRET: 'isolated-test-secret', ADMIN_ALLOWED_EMAILS: adminEmails,
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.invalid', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fixture-key' } },
    fetch: async () => ({ ok: true, json: async () => ({ user }) }),
    require: (name) => {
      if (name === 'next/headers') return { cookies: async () => ({ get: () => undefined }) };
      if (name === 'react') return { cache: (fn) => fn };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  context.exports = context.module.exports;
  const source = readFileSync(join(__dirname, '../lib/auth.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, context);
  return context.module.exports;
}

function signedFixture(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${createHmac('sha256', 'isolated-test-secret').update(body).digest('base64url')}`;
}

test('legacy signed admin sessions cannot obtain trusted claims', async () => {
  const auth = authModule();
  const legacy = signedFixture({ name: 'fixture', email: 'user@example.invalid', role: 'admin', exp: Date.now() / 1000 + 3600 });
  assert.equal(await auth.decodeSession(legacy), null);
});

test('current sessions round trip and expired or tampered cookies are rejected', async () => {
  const auth = authModule();
  const cookie = await auth.encodeSession({ name: 'fixture', email: 'user@example.invalid', role: 'student' });
  assert.equal((await auth.decodeSession(cookie)).role, 'student');
  const [body, signature] = cookie.split('.');
  const forged = JSON.parse(Buffer.from(body, 'base64url').toString());
  forged.role = 'admin';
  assert.equal(await auth.decodeSession(`${Buffer.from(JSON.stringify(forged)).toString('base64url')}.${signature}`), null);
  assert.equal(await auth.decodeSession(signedFixture({ auth_version: 2, email: 'user@example.invalid', role: 'admin', exp: 1 })), null);
});

test('editable user metadata cannot grant admin', async () => {
  const user = { email: 'user@example.invalid', user_metadata: { role: 'admin' }, app_metadata: {} };
  assert.equal((await authModule(user).authenticateUser(user.email, 'fixture', 'admin')).user, null);
  assert.equal((await authModule(user).authenticateUser(user.email, 'fixture', 'student')).user.role, 'student');
});

test('trusted app metadata and configured allowlist grant admin', async () => {
  const user = { email: 'user@example.invalid', app_metadata: { role: 'admin' } };
  assert.equal((await authModule(user).authenticateUser(user.email, 'fixture', 'admin')).user.role, 'admin');
  const allowed = { email: 'owner@example.invalid', user_metadata: { role: 'student' } };
  assert.equal((await authModule(allowed, allowed.email).authenticateUser(allowed.email, 'fixture', 'admin')).user.role, 'admin');
});
