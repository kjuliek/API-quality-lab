function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  const errors = [];
  if (!password || password.length < 8) errors.push('Minimum 8 characters required');
  if (!password || !/[A-Z]/.test(password)) errors.push('At least one uppercase letter required');
  if (!password || !/[a-z]/.test(password)) errors.push('At least one lowercase letter required');
  if (!password || !/[0-9]/.test(password)) errors.push('At least one digit required');
  if (!password || !/[!@#$%^&*]/.test(password)) errors.push('At least one special character required (!@#$%^&*)');
  return { valid: errors.length === 0, errors };
}

function isValidAge(age) {
  if (typeof age !== 'number') return false;
  if (!Number.isInteger(age)) return false;
  return age >= 0 && age <= 150;
}

module.exports = { isValidEmail, isValidPassword, isValidAge };
