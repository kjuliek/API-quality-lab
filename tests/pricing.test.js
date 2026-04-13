const { calculateDeliveryFee } = require('../src/pricing');

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