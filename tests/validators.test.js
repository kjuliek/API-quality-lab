const { isValidEmail, isValidPassword, isValidAge } = require('../src/validators');

describe('isValidEmail', () => {
  it('should return true when given "user@example.com"', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('should return true when given "user.name+tag@domain.co"', () => {
    expect(isValidEmail('user.name+tag@domain.co')).toBe(true);
  });

  it('should return false when given "invalid"', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('should return false when given "@domain.com"', () => {
    expect(isValidEmail('@domain.com')).toBe(false);
  });

  it('should return false when given "user@"', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('should return false when given ""', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should return false when given null', () => {
    expect(isValidEmail(null)).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('should return valid true and no errors when given "Passw0rd!"', () => {
    const result = isValidPassword('Passw0rd!');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should return valid false with multiple errors when given "short"', () => {
    const result = isValidPassword('short');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimum 8 characters required');
    expect(result.errors).toContain('At least one uppercase letter required');
    expect(result.errors).toContain('At least one digit required');
    expect(result.errors).toContain('At least one special character required (!@#$%^&*)');
  });

  it('should return error for missing uppercase when given "alllowercase1!"', () => {
    const result = isValidPassword('alllowercase1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('At least one uppercase letter required');
  });

  it('should return error for missing lowercase when given "ALLUPPERCASE1!"', () => {
    const result = isValidPassword('ALLUPPERCASE1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('At least one lowercase letter required');
  });

  it('should return error for missing digit when given "NoDigits!here"', () => {
    const result = isValidPassword('NoDigits!here');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('At least one digit required');
  });

  it('should return error for missing special character when given "NoSpecial1here"', () => {
    const result = isValidPassword('NoSpecial1here');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('At least one special character required (!@#$%^&*)');
  });

  it('should return valid false with all errors when given ""', () => {
    const result = isValidPassword('');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(5);
  });

  it('should return valid false with all errors when given null', () => {
    const result = isValidPassword(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(5);
  });
});

describe('isValidAge', () => {
  it('should return true when given 25', () => {
    expect(isValidAge(25)).toBe(true);
  });

  it('should return true when given 0', () => {
    expect(isValidAge(0)).toBe(true);
  });

  it('should return true when given 150', () => {
    expect(isValidAge(150)).toBe(true);
  });

  it('should return false when given -1', () => {
    expect(isValidAge(-1)).toBe(false);
  });

  it('should return false when given 151', () => {
    expect(isValidAge(151)).toBe(false);
  });

  it('should return false when given 25.5', () => {
    expect(isValidAge(25.5)).toBe(false);
  });

  it('should return false when given "25"', () => {
    expect(isValidAge('25')).toBe(false);
  });

  it('should return false when given null', () => {
    expect(isValidAge(null)).toBe(false);
  });
});
