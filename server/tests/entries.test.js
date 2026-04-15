const request = require('supertest');
const { app, init } = require('../app');

describe('Entries endpoints', () => {
  let token;
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    init();
    const email = `entrytest+${Date.now()}@example.com`;
    const password = 'password123';
    await request(app).post('/api/auth/register').send({ name: 'E', email, password });
    const login = await request(app).post('/api/auth/login').send({ email, password });
    token = login.body.token;
  });

  test('create and list entries', async () => {
    const entry = {
      date: new Date().toISOString(),
      category: 'Food',
      description: 'Lunch',
      type: 'Saida',
      value: 12.5,
      payment_method: 'Card',
      necessary: true,
      notes: ''
    };

    const create = await request(app)
      .post('/api/entries')
      .set('Authorization', `Bearer ${token}`)
      .send(entry)
      .expect(200);

    expect(create.body.id).toBeTruthy();

    const list = await request(app)
      .get('/api/entries')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(list.body.entries)).toBe(true);
    expect(list.body.entries.length).toBeGreaterThanOrEqual(1);
  });
});
