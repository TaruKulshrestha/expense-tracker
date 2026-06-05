const request = require('supertest');
const app = require('../index');

describe('Budget API', () => {
  test('GET /api/budgets - returns budget object', async () => {
    const res = await request(app).get('/api/budgets');
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
  });

  test('PUT /api/budgets - saves valid budgets', async () => {
    const res = await request(app)
      .put('/api/budgets')
      .send({ Food: 5000, Transport: 2000, Bills: '' });
    expect(res.status).toBe(200);
    expect(res.body.Food).toBe(5000);
    expect(res.body.Transport).toBe(2000);
    expect(res.body.Bills).toBeUndefined();
  });

  test('PUT /api/budgets - rejects negative amount', async () => {
    const res = await request(app)
      .put('/api/budgets')
      .send({ Food: -100 });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
