const express = require('express');
const { calculateOrderTotal } = require('../pricing');
const promoCodes = require('../promoCodes');
const validateOrderBody = require('../middleware/validateOrderBody');

const router = express.Router();
let orders = [];

function resetOrders() {
  orders = [];
}

router.post('/simulate', validateOrderBody, (req, res, next) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
    const result = calculateOrderTotal(items, distance, weight, promoCode, promoCodes, hour, dayOfWeek);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', validateOrderBody, (req, res, next) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
    const result = calculateOrderTotal(items, distance, weight, promoCode, promoCodes, hour, dayOfWeek);
    const order = { id: crypto.randomUUID(), ...result };
    orders.push(order);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = { router, resetOrders };
