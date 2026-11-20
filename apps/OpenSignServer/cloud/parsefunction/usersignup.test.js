// Run with: node --test apps/OpenSignServer/cloud/parsefunction/usersignup.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Minimal in-memory Parse global used by usersignup.js. No user or tenant row exists yet,
// so the sign-up branch runs.
const savedUsers = [];
class FakeObject {
  constructor() {
    this.data = {};
  }
  set(key, value) {
    this.data[key] = value;
  }
  async save() {
    return { id: 'tenant1' };
  }
  static extend() {
    return FakeObject;
  }
}
class FakeUser extends FakeObject {
  async signUp() {
    savedUsers.push(this);
    return { id: 'user1', getSessionToken: () => 'session-token-1' };
  }
}
class FakeQuery {
  equalTo() {}
  async first() {
    return undefined;
  }
}
globalThis.Parse = { Object: FakeObject, User: FakeUser, Query: FakeQuery };

test('usersignup stores the lower-cased, whitespace-free email as normalizedEmail', async () => {
  const { default: usersignup } = await import('./usersignup.js');
  const result = await usersignup({
    params: {
      userDetails: {
        email: '  Jane.Doe@Example.COM ',
        password: 'not-a-real-password',
        name: 'Jane Doe',
        role: 'partners_admin',
        company: 'Example Co',
      },
    },
  });
  assert.equal(result?.message, 'User sign up');
  assert.equal(savedUsers.length, 1);
  assert.equal(savedUsers[0].data.normalizedEmail, 'jane.doe@example.com');
});
