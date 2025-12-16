/**
 * @fileoverview Utility functions for string manipulation.
 */

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} str The input string.
 * @returns {string} The string with its first letter capitalized, or an empty string if input is not a string or is empty.
 * @example
 * // Returns "Hello"
 * capitalizeFirstLetter("hello");
 * @example
 * // Returns ""
 * capitalizeFirstLetter("");
 */
export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reverses a given string.
 *
 * @param {string} str The input string.
 * @returns {string} The reversed string, or an empty string if input is not a string or is empty.
 * @example
 * // Returns "olleh"
 * reverseString("hello");
 * @example
 * // Returns ""
 * reverseString("");
 */
export function reverseString(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }
  return str.split('').reverse().join('');
}
