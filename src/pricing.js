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

function applyPromoCode(subtotal, promoCode, promoCodes) {
  if (typeof subtotal !== 'number') throw new TypeError('Subtotal must be a number');
  if (subtotal < 0) throw new TypeError('Subtotal cannot be negative');
  if (!promoCode) return subtotal;
  if (!promoCodes || promoCodes.length === 0) return subtotal;

  const promo = promoCodes.find(p => p.code === promoCode);
  if (!promo) throw new Error(`Promo code "${promoCode}" not found`);

  const today = new Date().toISOString().split('T')[0];
  if (promo.expiresAt < today) throw new Error(`Promo code "${promoCode}" has expired`);
  if (subtotal < promo.minOrder) throw new Error(`Minimum order of ${promo.minOrder}€ required`);

  const { calculateDiscount } = require('./utils');
  return calculateDiscount(subtotal, [{ type: promo.type, value: promo.value }]);
}

function calculateSurge(hour, dayOfWeek) {
  if (hour < 10 || hour >= 22) return 0;
  if (dayOfWeek === 6 && hour >= 11.5 && hour < 14) return 1.5;
  if (hour >= 11.5 && hour < 14) return 1.3;
  if ((dayOfWeek === 5 || dayOfWeek === 6) && hour >= 18) return 1.8;
  if (dayOfWeek >= 1 && dayOfWeek <= 4 && hour >= 18) return 1.5;
  if (dayOfWeek === 0 || dayOfWeek === 6) return 1.2;
  return 1.0;
}

function calculateOrderTotal(items, distance, weight, promoCode, promoCodes, hour, dayOfWeek) {
  if (!items || items.length === 0) throw new Error('Order must contain at least one item');
  for (const item of items) {
    if (item.quantity <= 0) throw new Error('Item quantity must be greater than 0');
  }
  const subtotal = items.reduce((sum, item) => item.price * item.quantity + sum, 0);
  const discountedSubtotal = applyPromoCode(subtotal, promoCode, promoCodes);
  const discount = parseFloat((subtotal - discountedSubtotal).toFixed(2));
  const deliveryFee = calculateDeliveryFee(distance, weight);
  const surge = calculateSurge(hour, dayOfWeek);
  if (surge === 0) throw new Error('Restaurant is closed at this time');
  const total = parseFloat((discountedSubtotal + deliveryFee * surge).toFixed(2));
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount,
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    surge,
    total,
  };
}

module.exports = { calculateDeliveryFee, applyPromoCode, calculateSurge, calculateOrderTotal };