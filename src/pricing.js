function calculateDeliveryFee(distance, weight) {
  if (typeof distance !== 'number') throw new TypeError('Distance must be a number');
  if (typeof weight !== 'number') throw new TypeError('Weight must be a number');
  if (distance < 0) throw new TypeError('Distance cannot be negative');
  if (weight < 0) throw new TypeError('Weight cannot be negative');
  if (distance === 0) return 0.00;
  if (distance > 10) throw new RangeError('Delivery not available beyond 10 km');
  let fee = 2.00;
  if (distance > 3) {
    fee += (distance - 3) * 0.50;
  }
  if (weight > 5) {
    fee += 1.50;
  }
  return fee;
}

module.exports = { calculateDeliveryFee };