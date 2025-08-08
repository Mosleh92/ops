const test = require('node:test');
const assert = require('node:assert/strict');

const { AuthService } = require('../src/services/AuthService');

test('AuthService.generateMfaCode returns 6-digit code within range', () => {
  const code = AuthService.generateMfaCode(() => 123456);
  assert.equal(code.length, 6);
  const num = Number(code);
  assert.ok(num >= 100000 && num <= 999999);
});

test('AuthService.generateMfaCode handles lower bound', () => {
  const code = AuthService.generateMfaCode(() => 100000);
  assert.equal(code, '100000');
});

test('AuthService.generateMfaCode handles upper bound', () => {
  const code = AuthService.generateMfaCode(() => 999999);
  assert.equal(code, '999999');
});
