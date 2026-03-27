function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function calculateAverage(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
}

function slugify(text) {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

module.exports = { capitalize, calculateAverage, slugify, clamp };
