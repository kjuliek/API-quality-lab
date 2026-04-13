const express = require('express');
const { applyPromoCode } = require('../pricing');
const promoCodes = require('../promoCodes');

const router = express.Router();

router.post('/validate', (req, res, next) => {
  try {
    const { code, amount } = req.body;
    if (!code) return res.status(400).json({ error: 'Promo code is required' });

    const promo = promoCodes.find(p => p.code === code);
    if (!promo) return res.status(404).json({ error: `Promo code "${code}" not found` });

    const newAmount = applyPromoCode(amount, code, promoCodes);
    const discount = parseFloat((amount - newAmount).toFixed(2));
    res.json({ valid: true, code, discount, newAmount });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
