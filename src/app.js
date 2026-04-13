const express = require('express');
const { router: ordersRouter } = require('./routes/orders');
const promoRouter = require('./routes/promo');

const app = express();
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/orders', ordersRouter);
app.use('/promo', promoRouter);

// Error handler
app.use((err, req, res, next) => {
  const status = err instanceof RangeError ? 400 : err.status || 400;
  res.status(status).json({ error: err.message });
});

module.exports = app;
