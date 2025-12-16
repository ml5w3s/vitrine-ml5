import { capitalizeFirstLetter, reverseString } from './stringUtils.js';

describe('stringUtils', () => {
  describe('capitalizeFirstLetter', () => {
    test('should capitalize the first letter of a string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
    });

    test('should return an empty string for an empty input', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    test('should return an empty string if input is not a string', () => {
      expect(capitalizeFirstLetter(null)).toBe('');
      expect(capitalizeFirstLetter(undefined)).toBe('');
      expect(capitalizeFirstLetter(123)).toBe('');
    });

    test('should handle strings that are already capitalized', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello');
    });
  });

  describe('reverseString', () => {
    test('should reverse a given string', () => {
      expect(reverseString('hello')).toBe('olleh');
      expect(reverseString('world')).toBe('dlrow');
    });

    test('should return an empty string for an empty input', () => {
      expect(reverseString('')).toBe('');
    });

    test('should return an empty string if input is not a string', () => {
      expect(reverseString(null)).toBe('');
      expect(reverseString(undefined)).toBe('');
      expect(reverseString(123)).toBe('');
    });

    test('should handle single character strings', () => {
      expect(reverseString('a')).toBe('a');
    });
  });
});
