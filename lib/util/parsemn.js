'use strict'

/**
 * Parse m-n text into [m, n];
 */

module.exports = function parseMN(text) {
  if (!text) {
    throw new Error('No m-n parameter');
  }

  const regex = /^(\d+)(-|of|-of-)?(\d+)$/i;
  const match = regex.exec(text.trim());

  if (!match || match.length === 0) {
    throw new Error('Invalid m-n parameter');
  }

  const m = parseInt(match[1]);
  const n = parseInt(match[3]);

  if (m > n) {
    throw new Error('Invalid m-n parameter');
  }

  return [m, n];
}