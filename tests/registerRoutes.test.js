const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register');
const express = require('express');
const request = require('supertest');
const { registerRoutes } = require('../src/registerRoutes');

test('registerRoutes exposes /api info', async () => {
  const app = express();
  registerRoutes(app);
  const res = await request(app).get('/api');
  assert.equal(res.status, 200);
  assert.equal(res.body.name, 'MallOS Enterprise API');
  assert.ok(res.body.endpoints);
});
