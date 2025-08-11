const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register');
const { configureWebSocket } = require('../src/configureWebSocket');

test('configureWebSocket registers handlers', () => {
  let used = false;
  let connectionRegistered = false;
  const io = {
    use: () => {
      used = true;
    },
    on: (event, handler) => {
      if (event === 'connection') {
        connectionRegistered = typeof handler === 'function';
      }
    },
    to: () => ({ emit: () => {} })
  };

  configureWebSocket(io);
  assert.equal(used, true);
  assert.equal(connectionRegistered, true);
});
