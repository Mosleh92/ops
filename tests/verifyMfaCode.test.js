const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Read AuthService source
const authServicePath = path.resolve(__dirname, '../src/services/AuthService.ts');
const source = fs.readFileSync(authServicePath, 'utf8');

function extractMethod(name) {
  const start = source.indexOf(`static async ${name}`);
  if (start === -1) throw new Error(`Method ${name} not found`);
  const braceStart = source.indexOf('{', start);
  let index = braceStart + 1;
  let depth = 1;
  while (depth > 0 && index < source.length) {
    const char = source[index++];
    if (char === '{') depth++;
    else if (char === '}') depth--;
  }
  const method = source.slice(start, index);
  return method
    .replace(/userId: string/g, 'userId')
    .replace(/code: string/g, 'code')
    .replace(/: Promise<[^>]+>/g, '')
    .replace(/: string/g, '');
}

const classBody = `
const crypto = require('node:crypto');
const redis = mockRedis;
class AuthService {
${extractMethod('generateMfaCode')}
${extractMethod('verifyMfaCode')}
}
module.exports = { AuthService };
`;

// Mock Redis implementation
const store = new Map();
const mockRedis = {
  async get(key) {
    return store.has(key) ? store.get(key) : null;
  },
  async set(key, value, ..._args) {
    store.set(key, value);
  },
  async del(key) {
    store.delete(key);
  },
};

const context = { require, module: { exports: {} }, mockRedis };
vm.runInNewContext(classBody, context);
const { AuthService } = context.module.exports;

const redis = mockRedis;

test('verifyMfaCode removes code after successful verification', async () => {
  const userId = 'user1';
  const code = await AuthService.generateMfaCode(userId);

  const firstVerify = await AuthService.verifyMfaCode(userId, code);
  assert.equal(firstVerify, true);
  assert.equal(await redis.get(`mfa:${userId}`), null);

  const secondVerify = await AuthService.verifyMfaCode(userId, code);
  assert.equal(secondVerify, false);
});
