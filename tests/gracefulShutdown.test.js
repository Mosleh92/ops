const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register');
const { setupGracefulShutdown } = require('../src/gracefulShutdown');
const { iotService } = require('../src/services/IoTService');
const { aiAnalyticsService } = require('../src/services/AIAnalyticsService');
const { databaseManager } = require('../src/config/database');
const { redis } = require('../src/config/redis');

test('setupGracefulShutdown registers handlers and closes resources', async () => {
  let serverClosed = false;
  let ioClosed = false;
  const server = { close: (cb) => { serverClosed = true; cb && cb(); } };
  const io = { close: (cb) => { ioClosed = true; cb && cb(); } };

  let iotClean = false;
  let aiClean = false;
  let dbClosed = false;
  let redisClosed = false;
  iotService.cleanup = async () => { iotClean = true; };
  aiAnalyticsService.cleanup = async () => { aiClean = true; };
  databaseManager.close = async () => { dbClosed = true; };
  redis.disconnect = async () => { redisClosed = true; };

  let exitCode;
  const originalExit = process.exit;
  process.exit = (code) => { exitCode = code; };

  setupGracefulShutdown(server, io);
  const handler = process.listeners('SIGTERM').pop();
  handler();
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(serverClosed, true);
  assert.equal(ioClosed, true);
  assert.equal(iotClean, true);
  assert.equal(aiClean, true);
  assert.equal(dbClosed, true);
  assert.equal(redisClosed, true);
  assert.equal(exitCode, 0);

  process.exit = originalExit;
});
