// Run with: node --test apps/OpenSignServer/cloud/parsefunction/otp.test.js
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Minimal in-memory stand-in for the Parse global used by otp.js.
const rows = [];
class FakeObject {
  constructor(className) {
    this.className = className;
    this.data = {};
  }
  set(key, value) {
    this.data[key] = value;
  }
  get(key) {
    return this.data[key];
  }
  increment(key) {
    this.data[key] = (this.data[key] || 0) + 1;
  }
  // Parse rejects saving or deleting an object that is already gone.
  async save() {
    if (this.destroyed) throw new Error('Object not found.');
    if (!rows.includes(this)) rows.push(this);
    return this;
  }
  async destroy() {
    if (this.destroyed) throw new Error('Object not found.');
    this.destroyed = true;
    rows.splice(rows.indexOf(this), 1);
  }
}
class FakeQuery {
  constructor(className) {
    this.className = className;
    this.filters = {};
  }
  equalTo(key, value) {
    this.filters[key] = value;
  }
  async first() {
    return rows.find(
      r =>
        r.className === this.className &&
        Object.entries(this.filters).every(([k, v]) => r.data[k] === v)
    );
  }
}
globalThis.Parse = { Object: FakeObject, Query: FakeQuery };

const {
  issueOtp,
  verifyOtp,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_FAILURES,
  OTP_LOCK_MS,
  OTP_TTL_MS,
  OTP_RESEND_WAIT_MS,
} = await import('./otp.js');

const email = 'signer@example.com';
const record = () => rows.find(r => r.data.Email === email);
const wrongCode = code => (code === 999999 ? 100000 : code + 1);

beforeEach(() => {
  rows.length = 0;
});

test('issues a six-digit code', async () => {
  const code = await issueOtp(email);
  assert.ok(Number.isInteger(code) && code >= 100000 && code <= 999999);
});

test('accepts the right code once only', async () => {
  const code = await issueOtp(email);
  assert.equal(await verifyOtp(email, String(code)), true);
  assert.equal(await verifyOtp(email, String(code)), false);
});

test('rejects a wrong code and a missing record', async () => {
  const code = await issueOtp(email);
  assert.equal(await verifyOtp(email, wrongCode(code)), false);
  assert.equal(await verifyOtp('nobody@example.com', code), false);
  assert.equal(await verifyOtp(email, 'abc'), false);
});

test('rejects an expired code', async () => {
  const code = await issueOtp(email);
  record().data.ExpiresAt = new Date(Date.now() - 1);
  assert.equal(await verifyOtp(email, code), false);
});

test('rejects a code stored without an expiry (issued before this change)', async () => {
  const legacy = new FakeObject('defaultdata_Otp');
  legacy.set('Email', email);
  legacy.set('OTP', 1234);
  await legacy.save();
  assert.equal(await verifyOtp(email, 1234), false);
});

test('locks the code after too many wrong guesses', async () => {
  const code = await issueOtp(email);
  for (let i = 0; i < OTP_MAX_ATTEMPTS; i++) {
    assert.equal(await verifyOtp(email, wrongCode(code)), false);
  }
  assert.equal(await verifyOtp(email, code), false);
});

test('does not issue a second code straight away, then does after the wait', async () => {
  const first = await issueOtp(email);
  assert.equal(await issueOtp(email), null);
  assert.equal(await verifyOtp(email, first), true);

  await issueOtp(email);
  record().data.IssuedAt = new Date(Date.now() - OTP_RESEND_WAIT_MS - 1);
  record().data.Attempts = OTP_MAX_ATTEMPTS;
  const next = await issueOtp(email);
  assert.ok(Number.isInteger(next));
  assert.equal(record().data.Attempts, 0);
  assert.ok(record().data.ExpiresAt.getTime() > Date.now() + OTP_TTL_MS - 5000);
  assert.equal(await verifyOtp(email, next), true);
});

test('accepts only a plain string email', async () => {
  const code = await issueOtp(email);
  // An object would act as a Parse query operator and could match another record.
  assert.equal(await verifyOtp({ $in: [email] }, code), false);
  assert.equal(await verifyOtp([email], code), false);
  assert.equal(await verifyOtp('', code), false);
  await assert.rejects(() => issueOtp({ $in: [email] }), TypeError);
  assert.equal(await verifyOtp(email, code), true);
});

test('lets only one of two parallel requests use the code', async () => {
  const code = await issueOtp(email);
  const results = await Promise.all([verifyOtp(email, code), verifyOtp(email, code)]);
  assert.deepEqual(results.sort(), [false, true]);
});

test('returns false, not an error, when the record vanishes mid-check', async () => {
  const code = await issueOtp(email);
  const original = FakeQuery.prototype.first;
  // Each lookup returns its own copy, as real Parse does, so a parallel delete is not visible.
  FakeQuery.prototype.first = async function () {
    const row = await original.call(this);
    if (!row) return row;
    const copy = new FakeObject(row.className);
    copy.data = { ...row.data };
    copy.save = async () => {
      if (!rows.includes(row)) throw new Error('Object not found.');
      Object.assign(row.data, copy.data);
      return copy;
    };
    copy.destroy = () => row.destroy();
    return copy;
  };
  try {
    const results = await Promise.all([
      verifyOtp(email, code),
      verifyOtp(email, code),
      verifyOtp(email, code),
    ]);
    assert.equal(results.filter(Boolean).length, 1);
  } finally {
    FakeQuery.prototype.first = original;
  }
});

test('pauses the email after too many wrong guesses across codes', async () => {
  let code;
  for (let i = 0; i < OTP_MAX_FAILURES; i++) {
    if (i % OTP_MAX_ATTEMPTS === 0) {
      if (record()) record().data.IssuedAt = new Date(Date.now() - OTP_RESEND_WAIT_MS - 1);
      code = await issueOtp(email);
    }
    assert.equal(await verifyOtp(email, wrongCode(code)), false);
  }
  assert.ok(record().data.LockedUntil.getTime() > Date.now() + OTP_LOCK_MS - 5000);

  // While paused: no new code, and even the right code is refused.
  record().data.IssuedAt = new Date(Date.now() - OTP_RESEND_WAIT_MS - 1);
  assert.equal(await issueOtp(email), null);
  record().data.Attempts = 0;
  assert.equal(await verifyOtp(email, code), false);

  // After the pause a new code works.
  record().data.LockedUntil = new Date(Date.now() - 1);
  const next = await issueOtp(email);
  assert.equal(await verifyOtp(email, next), true);
});
