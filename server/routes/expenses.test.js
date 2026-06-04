const request = require('supertest');
const app = require('../index');

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

describe('Expense API', () => {
  let createdId;

  const validExpense = {
    amount: 250,
    category: 'Food',
    date: todayISO(),
    note: 'Lunch at office',
  };

  test('POST /api/expenses - creates a valid expense', async () => {
    const res = await request(app).post('/api/expenses').send(validExpense);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.amount).toBe(250);
    expect(res.body.category).toBe('Food');
    createdId = res.body.id;
  });

  test('POST /api/expenses - rejects negative amount', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ ...validExpense, amount: -50 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('amount must be a positive number');
  });

  test('POST /api/expenses - rejects future date', async () => {
    const future = new Date();
    future.setDate(future.getDate() + 2);
    const res = await request(app)
      .post('/api/expenses')
      .send({ ...validExpense, date: future.toISOString().split('T')[0] });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('date cannot be in the future');
  });

  test('GET /api/expenses - returns list with summary', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.expenses)).toBe(true);
    expect(res.body.summary).toHaveProperty('totalThisMonth');
    expect(res.body.summary).toHaveProperty('totalByCategory');
  });

  test('GET /api/expenses - filters by category', async () => {
    const res = await request(app).get('/api/expenses?category=Food');
    expect(res.status).toBe(200);
    expect(res.body.expenses.every((e) => e.category === 'Food')).toBe(true);
  });

  test('PUT /api/expenses/:id - updates an expense', async () => {
    const res = await request(app)
      .put(`/api/expenses/${createdId}`)
      .send({ ...validExpense, amount: 300, note: 'Updated note' });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(300);
    expect(res.body.note).toBe('Updated note');
  });

  test('DELETE /api/expenses/:id - deletes an expense', async () => {
    const res = await request(app).delete(`/api/expenses/${createdId}`);
    expect(res.status).toBe(204);
  });

  test('DELETE /api/expenses/:id - 404 on missing expense', async () => {
    const res = await request(app).delete('/api/expenses/does-not-exist');
    expect(res.status).toBe(404);
  });
});
