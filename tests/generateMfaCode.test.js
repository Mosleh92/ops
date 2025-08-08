const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

function generateMfaCode(randomFn = crypto.randomInt) {
  return randomFn(100000, 1000000).toString();
}

test('generateMfaCode returns 6-digit code within range', () => {
  const code = generateMfaCode();
  assert.equal(code.length, 6);
  const num = Number(code);
  assert.ok(num >= 100000 && num <= 999999);
});

test('generateMfaCode handles lower bound', () => {
  const code = generateMfaCode(() => 100000);
  assert.equal(code, '100000');
});

test('generateMfaCode handles upper bound', () => {
  const code = generateMfaCode(() => 999999);
  assert.equal(code, '999999');
});
