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
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('value, min and max must be numbers');
  }
  return Math.min(Math.max(value, min), max);
}

function sortStudents(students, sortBy, order = 'asc') {
  if (!students) return [];
  return [...students].sort((a, b) => (a[sortBy] > b[sortBy] ? (order === 'asc' ? 1 : -1) : (order === 'asc' ? -1 : 1)));
}

function parsePrice(input) {
  if (input === null || input === undefined) return null;
  if (typeof input === 'number') return input < 0 ? null : input;
  if (typeof input === 'string') {
    if (input.trim().toLowerCase() === 'gratuit') return 0;
    const cleaned = input.replace(/€/g, '').replace(',', '.').trim();
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return null;
    if (parsed < 0) return null;
    return parsed;
  }
  return null;
}

function groupBy(array, key) {
  if (!array) return {};
  const result = {};
  for (const item of array) {
    if (!(key in item)) throw new TypeError(`Key "${key}" does not exist on object`);
    const group = item[key];
    if (group === null || group === undefined) throw new TypeError(`Key "${key}" has a null or undefined value`);
    if (!result[group]) result[group] = [];
    result[group].push(item);
  }
  return result;
}

module.exports = { capitalize, calculateAverage, slugify, clamp, sortStudents, parsePrice, groupBy };
