const promoCodes = [
  { code: 'BIENVENUE20', type: 'percentage', value: 20, minOrder: 15.00, expiresAt: '2026-12-31' },
  { code: 'FIXED5', type: 'fixed', value: 5, minOrder: 10.00, expiresAt: '2026-12-31' },
  { code: 'EXPIRED', type: 'percentage', value: 10, minOrder: 0, expiresAt: '2020-01-01' },
  { code: 'MINORDER50', type: 'percentage', value: 10, minOrder: 50.00, expiresAt: '2026-12-31' },
];

module.exports = promoCodes;
