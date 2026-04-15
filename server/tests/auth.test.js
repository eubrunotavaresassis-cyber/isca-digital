const request = require('supertest');
const { app, init } = require('../app');

describe('Auth endpoints', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    init();
  });

  test('register -> login -> profile', async () => {
    const email = `test+${Date.now()}@example.com`;
    const password = 'password123';

    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Tester', email, password })
      .expect(200);

    expect(reg.body.token).toBeTruthy();
    expect(reg.body.user.email).toBe(email);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    expect(login.body.token).toBeTruthy();

    const profile = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(200);

    expect(profile.body.user.email).toBe(email);
  });
});

