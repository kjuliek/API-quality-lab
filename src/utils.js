function capitalize(str) {
  if (!str) return '';
  const index = str.search(/[a-zA-Z]/);
  if (index === -1) return str;
  return str.slice(0, index) + str[index].toUpperCase() + str.slice(index + 1).toLowerCase();
}

function calculateAverage(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  if (numbers.some((n) => typeof n !== 'number')) {
    throw new TypeError('All elements must be numbers');
  }
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
}

function slugify(text) {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

module.exports = { capitalize, calculateAverage, slugify, clamp };
