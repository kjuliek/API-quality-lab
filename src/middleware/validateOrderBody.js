function validateOrderBody(req, res, next) {
  const { items, distance, weight, hour, dayOfWeek } = req.body;

  if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be an array' });
  if (typeof distance !== 'number') return res.status(400).json({ error: 'distance must be a number' });
  if (typeof weight !== 'number') return res.status(400).json({ error: 'weight must be a number' });
  if (typeof hour !== 'number' || hour < 0 || hour > 23) return res.status(400).json({ error: 'hour must be between 0 and 23' });
  if (typeof dayOfWeek !== 'number' || dayOfWeek < 0 || dayOfWeek > 6) return res.status(400).json({ error: 'dayOfWeek must be between 0 and 6' });

  next();
}

module.exports = validateOrderBody;
