const { calculateDeliveryFee, applyPromoCode } = require('../src/pricing');

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