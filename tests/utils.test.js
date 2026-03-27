const { capitalize, calculateAverage, slugify, clamp } = require('../src/utils');

describe('capitalize', () => {
  it('should return "Hello" when given "hello"', () => {
    // Arrange
    const input = 'hello';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('Hello');
  });

  it('should return "World" when given "WORLD"', () => {
    // Arrange
    const input = 'WORLD';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('World');
  });

  it('should return "" when given ""', () => {
    // Arrange
    const input = '';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('');
  });

  it('should return "" when given null', () => {
    // Arrange
    const input = null;
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('');
  });
});

describe('calculateAverage', () => {
  it('should return 12 when given [10, 12, 14]', () => {
    // Arrange
    const input = [10, 12, 14];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(12);
  });

  it('should return 15 when given [15]', () => {
    // Arrange
    const input = [15];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(15);
  });

  it('should return 0 when given []', () => {
    // Arrange
    const input = [];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(0);
  });

  it('should return 0 when given null', () => {
    // Arrange
    const input = null;
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(0);
  });
});

describe('slugify', () => {
  it('should return "hello-world" when given "Hello World"', () => {
    // Arrange
    const input = 'Hello World';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('hello-world');
  });

  it('should return "spaces-everywhere" when given " Spaces Everywhere "', () => {
    // Arrange
    const input = ' Spaces Everywhere ';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('spaces-everywhere');
  });

  it('should return "cest-lete" when given "C\'est l\'ete !"', () => {
    // Arrange
    const input = "C'est l'ete !";
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('cest-lete');
  });

  it('should return "" when given ""', () => {
    // Arrange
    const input = '';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('');
  });
});

describe('clamp', () => {
  it('should return 5 when value is 5 and range is [0, 10]', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('should return 0 when value is -5 and range is [0, 10]', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should return 10 when value is 15 and range is [0, 10]', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should return 0 when value is 0 and range is [0, 0]', () => {
    expect(clamp(0, 0, 0)).toBe(0);
  });
});
