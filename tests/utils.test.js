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

  it('should return "A" when given "a"', () => {
    // Arrange
    const input = 'a';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('A');
  });

  it('should return "Hello2world" when given "hello2world"', () => {
    // Arrange
    const input = 'hello2world';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('Hello2world');
  });

  it('should return "!Hello" when given "!hello"', () => {
    // Arrange
    const input = '!hello';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('!Hello');
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

  it('should return -7.5 when given [-10, -5]', () => {
    // Arrange
    const input = [-10, -5];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(-7.5);
  });

  it('should return 1.5 when given [1, 2]', () => {
    // Arrange
    const input = [1, 2];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(1.5);
  });

  it('should round to 2 decimal places when given [1.005, 1.006]', () => {
    // Arrange
    const input = [1.005, 1.006];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(1.01);
  });

  it('should throw a TypeError when given an array with a non-number', () => {
    // Arrange
    const input = [1, 'abc', 3];
    // Act & Assert
    expect(() => calculateAverage(input)).toThrow(TypeError);
    expect(() => calculateAverage(input)).toThrow('All elements must be numbers');
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

  it('should return "hello-world" when given "hello   world"', () => {
    // Arrange
    const input = 'hello   world';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('hello-world');
  });

  it('should return "" when given "!!!"', () => {
    // Arrange
    const input = '!!!';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('');
  });

  it('should return "hello-123-world" when given "Hello 123 World"', () => {
    // Arrange
    const input = 'Hello 123 World';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('hello-123-world');
  });

  it('should return "hello-world" when given "hello ! world"', () => {
    // Arrange
    const input = 'hello ! world';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('hello-world');
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

  it('should return 0 when value equals min', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it('should return 10 when value equals max', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('should return -3 when value is -3 and range is [-5, -1]', () => {
    expect(clamp(-3, -5, -1)).toBe(-3);
  });

  it('should throw a TypeError when value is not a number', () => {
    expect(() => clamp('a', 0, 10)).toThrow(TypeError);
    expect(() => clamp('a', 0, 10)).toThrow('value, min and max must be numbers');
  });
});
