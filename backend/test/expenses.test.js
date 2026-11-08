const mongoose = require('mongoose');
const request = require('supertest');
const { app, Expense } = require('../src/app');

beforeAll(() => mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/expenses_test'));
afterEach(() => Expense.deleteMany({}));
afterAll(() => mongoose.disconnect());

test('health responde ok', async () => {
  const res = await request(app).get('/api/health');
  expect(res.body).toEqual({ status: 'ok' });
});

test('crea, lista y borra un gasto', async () => {
  const created = await request(app).post('/api/expenses').send({ description: 'Café', amount: 2.5 });
  expect(created.status).toBe(201);

  const list = await request(app).get('/api/expenses');
  expect(list.body).toHaveLength(1);

  const del = await request(app).delete(`/api/expenses/${created.body._id}`);
  expect(del.status).toBe(204);
});

test('rechaza un gasto sin importe', async () => {
  const res = await request(app).post('/api/expenses').send({ description: 'Sin importe' });
  expect(res.status).toBe(400);
});

test('GET /api/expenses/total suma los importes', async () => {
  await request(app).post('/api/expenses').send({ description: 'pan', amount: 2 });
  const res = await request(app).get('/api/expenses/total');
  expect(res.status).toBe(200);
  expect(res.body.total).toBe(2);
});
