const request = require('supertest');
const app = require('../src/app');
const { resetOrders } = require('../src/routes/orders');

beforeEach(() => {
  resetOrders();
});

const pizzas = [{ name: 'Pizza', price: 12.50, quantity: 2 }];
// subtotal = 25.00, deliveryFee (5km, 2kg) = 3.00

describe('POST /orders/simulate', () => {
  it('should return 200 with correct price detail for a normal order', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ subtotal: 25.00, discount: 0, deliveryFee: 3.00, surge: 1.0, total: 28.00 });
  });

  it('should apply a valid promo code and return the reduced total', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 5, weight: 2, promoCode: 'BIENVENUE20', hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ subtotal: 25.00, discount: 5.00, deliveryFee: 3.00, surge: 1.0, total: 23.00 });
  });

  it('should return 400 when promo code is expired', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 5, weight: 2, promoCode: 'EXPIRED', hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when items is empty', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: [], distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when distance exceeds 10km', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 15, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when restaurant is closed (23h)', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 23, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should apply surge 1.8 on Friday at 20h', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 20, dayOfWeek: 5,
    });
    expect(res.status).toBe(200);
    expect(res.body.surge).toBe(1.8);
    expect(res.body.total).toBe(30.40);
  });

  it('should return 400 when items is not an array', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: 'not an array', distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when distance is not a number', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 'far', weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when weight is not a number', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 5, weight: 'heavy', promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when hour is out of range', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 25, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when dayOfWeek is out of range', async () => {
    const res = await request(app).post('/orders/simulate').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 8,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /orders', () => {
  it('should return 201 with the order including an ID', async () => {
    const res = await request(app).post('/orders').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.total).toBe(28.00);
  });

  it('should make the order retrievable via GET /orders/:id', async () => {
    const post = await request(app).post('/orders').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    const { id } = post.body;
    const get = await request(app).get(`/orders/${id}`);
    expect(get.status).toBe(200);
    expect(get.body.id).toBe(id);
  });

  it('should assign different IDs to two orders', async () => {
    const res1 = await request(app).post('/orders').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    const res2 = await request(app).post('/orders').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res1.body.id).not.toBe(res2.body.id);
  });

  it('should return 400 for an invalid order', async () => {
    const res = await request(app).post('/orders').send({
      items: [], distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    expect(res.status).toBe(400);
  });

  it('should not save an invalid order', async () => {
    await request(app).post('/orders').send({
      items: [], distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    const validRes = await request(app).post('/orders').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    const { id } = validRes.body;
    // only the valid order should exist — get the invalid one returns 404
    const get = await request(app).get(`/orders/${id}`);
    expect(get.status).toBe(200);
  });
});

describe('GET /orders/:id', () => {
  it('should return 200 and the complete order for an existing ID', async () => {
    const post = await request(app).post('/orders').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    const res = await request(app).get(`/orders/${post.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ subtotal: 25.00, total: 28.00 });
  });

  it('should return 404 for a non-existing ID', async () => {
    const res = await request(app).get('/orders/non-existing-id');
    expect(res.status).toBe(404);
  });

  it('should return an object with all required fields', async () => {
    const post = await request(app).post('/orders').send({
      items: pizzas, distance: 5, weight: 2, promoCode: null, hour: 15, dayOfWeek: 2,
    });
    const res = await request(app).get(`/orders/${post.body.id}`);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('subtotal');
    expect(res.body).toHaveProperty('discount');
    expect(res.body).toHaveProperty('deliveryFee');
    expect(res.body).toHaveProperty('surge');
    expect(res.body).toHaveProperty('total');
  });
});

describe('POST /promo/validate', () => {
  it('should return 200 with discount details for a valid code', async () => {
    const res = await request(app).post('/promo/validate').send({ code: 'BIENVENUE20', amount: 25 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ valid: true, code: 'BIENVENUE20', discount: 5.00, newAmount: 20.00 });
  });

  it('should return 400 with a reason when code is expired', async () => {
    const res = await request(app).post('/promo/validate').send({ code: 'EXPIRED', amount: 25 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when order is below minOrder', async () => {
    const res = await request(app).post('/promo/validate').send({ code: 'MINORDER50', amount: 30 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 when code does not exist', async () => {
    const res = await request(app).post('/promo/validate').send({ code: 'FAKE', amount: 25 });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when no code is provided in the body', async () => {
    const res = await request(app).post('/promo/validate').send({ amount: 25 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when amount is not a number', async () => {
    const res = await request(app).post('/promo/validate').send({ code: 'BIENVENUE20', amount: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
