const { calculateDeliveryFee, applyPromoCode, calculateSurge, calculateOrderTotal } = require('../src/pricing');

describe('calculateDeliveryFee', () => {
  it('should return 2.00 when distance is 2 km and weight is 1 kg', () => {
    expect(calculateDeliveryFee(2, 1)).toBe(2.00);
  });

  it('should throw a TypeError when distance is not a number', () => {
    expect(() => calculateDeliveryFee('abc', 1)).toThrow(TypeError);
  });

  it('should throw a TypeError when weight is not a number', () => {
    expect(() => calculateDeliveryFee(2, 'abc')).toThrow(TypeError);
  });

  it('should return 2.00 when weight is 0', () => {
    expect(calculateDeliveryFee(2, 0)).toBe(2.00);
  });

  it('should return 2.25 when distance is 3.5 km', () => {
    // 2.00 + (3.5-3) * 0.50 = 2.25
    expect(calculateDeliveryFee(3.5, 1)).toBe(2.25);
  });

  it('should return 3.50 when weight is 5.1 kg and distance is 2 km', () => {
    // 2.00 + 1.50 = 3.50
    expect(calculateDeliveryFee(2, 5.1)).toBe(3.50);
  });

  it('should return 0.00 when distance is 0 (click & collect)', () => {
    expect(calculateDeliveryFee(0, 2)).toBe(0.00);
  });

  it('should throw a TypeError when weight is negative', () => {
    expect(() => calculateDeliveryFee(2, -1)).toThrow(TypeError);
  });

  it('should throw a TypeError when distance is negative', () => {
    expect(() => calculateDeliveryFee(-1, 1)).toThrow(TypeError);
  });

  it('should throw a RangeError when distance is greater than 10 km', () => {
    expect(() => calculateDeliveryFee(15, 1)).toThrow(RangeError);
  });

  it('should return 2.00 when distance is 2 km and weight is exactly 5 kg', () => {
    expect(calculateDeliveryFee(2, 5)).toBe(2.00);
  });

  it('should return 7.00 when distance is 10 km and weight is 6 kg', () => {
    // 2.00 + (10-3) * 0.50 + 1.50 = 7.00
    expect(calculateDeliveryFee(10, 6)).toBe(7.00);
  });

  it('should return 4.50 when distance is 5 km and weight is 8 kg', () => {
    // 2.00 + (5-3) * 0.50 + 1.50 = 4.50
    expect(calculateDeliveryFee(5, 8)).toBe(4.50);
  });

  it('should return 5.50 when distance is exactly 10 km', () => {
    // 2.00 + (10-3) * 0.50 = 5.50
    expect(calculateDeliveryFee(10, 1)).toBe(5.50);
  });

  it('should return 2.00 when distance is exactly 3 km', () => {
    expect(calculateDeliveryFee(3, 1)).toBe(2.00);
  });

  it('should return 4.00 when distance is 7 km and weight is 3 kg', () => {
    // 2.00 + (7-3) * 0.50 = 4.00
    expect(calculateDeliveryFee(7, 3)).toBe(4.00);
  });

  it('should return 3.50 when distance is 6 km and weight is 2 kg', () => {
    // 2.00 + (6-3) * 0.50 = 3.50
    expect(calculateDeliveryFee(6, 2)).toBe(3.50);
  });
});

describe('applyPromoCode', () => {
  const promoCodes = [
    { code: 'BIENVENUE20', type: 'percentage', value: 20, minOrder: 15.00, expiresAt: '2026-12-31' },
    { code: 'FIXED5', type: 'fixed', value: 5, minOrder: 10.00, expiresAt: '2026-12-31' },
    { code: 'FULL100', type: 'percentage', value: 100, minOrder: 0, expiresAt: '2026-12-31' },
    { code: 'EXPIRED', type: 'percentage', value: 10, minOrder: 0, expiresAt: '2020-01-01' },
    { code: 'EXPIRES_TODAY', type: 'percentage', value: 10, minOrder: 0, expiresAt: '2026-04-13' },
    { code: 'BIGFIXED', type: 'fixed', value: 10, minOrder: 0, expiresAt: '2026-12-31' },
    { code: 'MINORDER50', type: 'percentage', value: 10, minOrder: 50.00, expiresAt: '2026-12-31' },
  ];

  it('should apply a percentage discount of 20% on 50€', () => {
    // 50 - 20% = 40
    expect(applyPromoCode(50, 'BIENVENUE20', promoCodes)).toBe(40);
  });

  it('should apply a fixed discount of 5€ on 30€', () => {
    // 30 - 5 = 25
    expect(applyPromoCode(30, 'FIXED5', promoCodes)).toBe(25);
  });

  it('should return the subtotal unchanged when promoCode is null', () => {
    expect(applyPromoCode(50, null, promoCodes)).toBe(50);
  });

  it('should return the subtotal unchanged when promoCode is an empty string', () => {
    expect(applyPromoCode(50, '', promoCodes)).toBe(50);
  });

  it('should throw a TypeError when subtotal is negative', () => {
    expect(() => applyPromoCode(-10, 'BIENVENUE20', promoCodes)).toThrow(TypeError);
  });

  it('should throw an Error when promo code does not exist', () => {
    expect(() => applyPromoCode(50, 'FAKE', promoCodes)).toThrow(Error);
  });

  it('should throw an Error when promo code is expired', () => {
    expect(() => applyPromoCode(50, 'EXPIRED', promoCodes)).toThrow(Error);
  });

  it('should throw an Error when subtotal is below minOrder', () => {
    // BIENVENUE20 requires minOrder 15€, 5 < 15 → refused
    expect(() => applyPromoCode(5, 'BIENVENUE20', promoCodes)).toThrow(Error);
  });

  it('should return 0 when fixed discount exceeds subtotal', () => {
    // 5 - 10 = -5 → clamped to 0
    expect(applyPromoCode(5, 'BIGFIXED', promoCodes)).toBe(0);
  });

  it('should return 0 when percentage is 100%', () => {
    expect(applyPromoCode(50, 'FULL100', promoCodes)).toBe(0);
  });

  it('should accept a code that expires today', () => {
    // expiresAt === today → still valid, 10% of 50 = 5 → 45
    expect(applyPromoCode(50, 'EXPIRES_TODAY', promoCodes)).toBe(45);
  });

  it('should return 0 when subtotal is 0 and promoCode is null', () => {
    expect(applyPromoCode(0, null, promoCodes)).toBe(0);
  });

  it('should return subtotal unchanged when promoCodes is null', () => {
    expect(applyPromoCode(50, 'BIENVENUE20', null)).toBe(50);
  });

  it('should return subtotal unchanged when promoCodes is empty', () => {
    expect(applyPromoCode(50, 'BIENVENUE20', [])).toBe(50);
  });

  it('should apply discount when subtotal equals minOrder exactly', () => {
    // BIENVENUE20 minOrder = 15, subtotal = 15 → 15 - 20% = 12
    expect(applyPromoCode(15, 'BIENVENUE20', promoCodes)).toBe(12);
  });

  it('should throw a TypeError when subtotal is not a number', () => {
    expect(() => applyPromoCode('50', 'BIENVENUE20', promoCodes)).toThrow(TypeError);
  });
});

describe('calculateSurge', () => {
  it('should return 1.0 on Tuesday at 15h (normal)', () => {
    expect(calculateSurge(15, 2)).toBe(1.0);
  });

  it('should return 1.3 on Wednesday at 12h30 (lunch)', () => {
    expect(calculateSurge(12.5, 3)).toBe(1.3);
  });

  it('should return 1.5 on Thursday at 20h (dinner)', () => {
    expect(calculateSurge(20, 4)).toBe(1.5);
  });

  it('should return 1.8 on Friday at 20h (Fri-Sat evening)', () => {
    expect(calculateSurge(20, 5)).toBe(1.8);
  });

  it('should return 1.8 on Saturday at 20h (Fri-Sat evening)', () => {
    expect(calculateSurge(20, 6)).toBe(1.8);
  });

  it('should return 1.2 on Sunday at 14h', () => {
    expect(calculateSurge(14, 0)).toBe(1.2);
  });

  it('should return 1.5 on Saturday at 12h30 (lunch)', () => {
    expect(calculateSurge(12.5, 6)).toBe(1.5);
  });

  it('should return 1.2 on Saturday at 15h (normal)', () => {
    expect(calculateSurge(15, 6)).toBe(1.2);
  });

  it('should return 0 on Monday at 22h (closed)', () => {
    expect(calculateSurge(22, 1)).toBe(0);
  });

  it('should return 0 on Monday at 9h (before opening)', () => {
    expect(calculateSurge(9, 1)).toBe(0);
  });

  it('should return 1.3 on Monday at 11h30 (start of lunch)', () => {
    expect(calculateSurge(11.5, 1)).toBe(1.3);
  });

  it('should return 1.3 on Friday at 11h30 (lunch)', () => {
    expect(calculateSurge(11.5, 5)).toBe(1.3);
  });

  it('should return 1.5 on Monday at 18h (start of dinner)', () => {
    expect(calculateSurge(18, 1)).toBe(1.5);
  });
});

describe('calculateOrderTotal', () => {
  const promoCodes = [
    { code: 'BIENVENUE20', type: 'percentage', value: 20, minOrder: 15.00, expiresAt: '2026-12-31' },
    { code: 'FIXED5', type: 'fixed', value: 5, minOrder: 10.00, expiresAt: '2026-12-31' },
  ];

  const pizzas = [{ name: 'Pizza', price: 12.50, quantity: 2 }];

  it('should return correct totals for 2 pizzas, 5km, 2kg, Tuesday 15h', () => {
    // subtotal = 2 * 12.50 = 25.00
    // deliveryFee = 2.00 + (5-3)*0.50 = 3.00
    // surge = 1.0, discount = 0
    // total = 25.00 + 3.00 * 1.0 = 28.00
    const result = calculateOrderTotal(pizzas, 5, 2, null, promoCodes, 15, 2);
    expect(result).toEqual({ subtotal: 25.00, discount: 0, deliveryFee: 3.00, surge: 1.0, total: 28.00 });
  });

  it('should apply BIENVENUE20 promo and return discount = 5, total = 23', () => {
    // subtotal = 25.00, discount = 25 * 20% = 5.00
    // deliveryFee = 3.00, surge = 1.0
    // total = 20.00 + 3.00 = 23.00
    const result = calculateOrderTotal(pizzas, 5, 2, 'BIENVENUE20', promoCodes, 15, 2);
    expect(result).toEqual({ subtotal: 25.00, discount: 5.00, deliveryFee: 3.00, surge: 1.0, total: 23.00 });
  });

  it('should apply surge 1.8 on Friday at 20h and return total = 30.40', () => {
    // subtotal = 25.00, discount = 0
    // deliveryFee = 3.00, surge = 1.8
    // total = 25.00 + 3.00 * 1.8 = 30.40
    const result = calculateOrderTotal(pizzas, 5, 2, null, promoCodes, 20, 5);
    expect(result).toEqual({ subtotal: 25.00, discount: 0, deliveryFee: 3.00, surge: 1.8, total: 30.40 });
  });

  it('should throw an Error when items is empty', () => {
    expect(() => calculateOrderTotal([], 5, 2, null, promoCodes, 15, 2)).toThrow(Error);
  });

  it('should throw an Error when an item has quantity 0', () => {
    const items = [{ name: 'Pizza', price: 12.50, quantity: 0 }];
    expect(() => calculateOrderTotal(items, 5, 2, null, promoCodes, 15, 2)).toThrow(Error);
  });

  it('should throw an Error when an item has a negative price', () => {
    const items = [{ name: 'Pizza', price: -5, quantity: 2 }];
    expect(() => calculateOrderTotal(items, 5, 2, null, promoCodes, 15, 2)).toThrow(Error);
  });

  it('should throw an Error when the restaurant is closed (23h)', () => {
    expect(() => calculateOrderTotal(pizzas, 5, 2, null, promoCodes, 23, 2)).toThrow(Error);
  });

  it('should throw a RangeError when distance exceeds 10km', () => {
    expect(() => calculateOrderTotal(pizzas, 15, 2, null, promoCodes, 15, 2)).toThrow(RangeError);
  });

  it('should return discount = 0 when no promo code is provided', () => {
    const result = calculateOrderTotal(pizzas, 5, 2, null, promoCodes, 15, 2);
    expect(result.discount).toBe(0);
  });

  it('should round all amounts to 2 decimal places', () => {
    // deliveryFee = 2.00 + (3.5-3)*0.50 = 2.25
    // surge = 1.3 (Wednesday lunch)
    // deliveryFee * surge = 2.25 * 1.3 = 2.925 → 2.93
    // total = 20.00 + 2.93 = 22.93
    const items = [{ name: 'Burger', price: 20, quantity: 1 }];
    const result = calculateOrderTotal(items, 3.5, 2, null, promoCodes, 12, 3);
    expect(result).toEqual({ subtotal: 20.00, discount: 0, deliveryFee: 2.25, surge: 1.3, total: 22.93 });
  });

  it('should correctly sum multiple items', () => {
    // 2 pizzas * 12.50 = 25.00, 3 burgers * 8.00 = 24.00 → subtotal = 49.00
    // deliveryFee = 3.00, surge = 1.0, total = 52.00
    const items = [
      { name: 'Pizza', price: 12.50, quantity: 2 },
      { name: 'Burger', price: 8.00, quantity: 3 },
    ];
    const result = calculateOrderTotal(items, 5, 2, null, promoCodes, 15, 2);
    expect(result).toEqual({ subtotal: 49.00, discount: 0, deliveryFee: 3.00, surge: 1.0, total: 52.00 });
  });

  it('should return deliveryFee = 0 and total = subtotal for click & collect (distance = 0)', () => {
    // distance = 0 → click & collect → no delivery fee
    const result = calculateOrderTotal(pizzas, 0, 2, null, promoCodes, 15, 2);
    expect(result).toEqual({ subtotal: 25.00, discount: 0, deliveryFee: 0, surge: 1.0, total: 25.00 });
  });
});