const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register');
const express = require('express');
const request = require('supertest');
const { setupMiddleware } = require('../src/setupMiddleware');

test('setupMiddleware adds healthz route', async () => {
  const app = express();
  setupMiddleware(app);
  const res = await request(app).get('/healthz');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});
