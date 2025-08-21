const request = require('supertest');
const app = require('../index'); // express app
describe('auth', ()=> {
  it('register and login', async ()=> {
    const email = 't1@local';
    await request(app).post('/api/auth/register').send({ name:'t', email, password:'pass' }).expect(200);
    const r = await request(app).post('/api/auth/login').send({ email, password:'pass' }).expect(200);
    expect(r.body.token).toBeDefined();
  });
});
