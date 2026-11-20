// Run with: node --test apps/OpenSignServer/cloud/parsefunction/saveFile.test.js
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

// Minimal Parse global used by saveFile.js (query for contracts_Users and Parse.Error).
class FakeQuery {
  constructor(className) {
    this.className = className;
  }
  equalTo() {}
  include() {}
  async first() {
    return { id: 'ext1', className: this.className };
  }
}
class FakeParseError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
FakeParseError.INVALID_QUERY = 102;
FakeParseError.OBJECT_NOT_FOUND = 101;
FakeParseError.INVALID_SESSION_TOKEN = 209;
globalThis.Parse = { Query: FakeQuery, Error: FakeParseError };

// saveFile.js uploads to cloudServerUrl (http://localhost:8080/app). Stand in for that server.
const UPLOADED_URL = 'https://example.invalid/saved.png';
let server;
before(async () => {
  server = http.createServer((req, res) => {
    req.resume();
    req.on('end', () => {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ name: 'saved.png', url: UPLOADED_URL }));
    });
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(8080, '127.0.0.1', resolve);
  });
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('saveFile returns the secure url of an uploaded png', async () => {
  const { default: saveFile } = await import('./saveFile.js');
  const result = await saveFile({
    user: { id: 'user1' },
    params: {
      fileName: 'signed.png',
      fileBase64: Buffer.from('fake-image-bytes').toString('base64'),
    },
  });
  assert.deepEqual(result, { url: UPLOADED_URL });
});
