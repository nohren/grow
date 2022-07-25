/**
 * @param {int} array index
 * @param {int} factor int - How spread out the coordinates will be, the smaller the less separation
 * @returns {int} Vector3.x
 *
 * Using modulo, or the remainder from multiples of bottom number to get to top, along with 4 graph quadrants to decide position given index number.
 */
export const setXpos = (i, factor = 1) => {
  factor *= Math.ceil((i % 4 === 0 ? i + 1 : i) / 4);
  return i % 4 === 0 || i % 4 === 1 ? factor : -1 * factor;
};
/**
 *
 * @param {int} i
 * @param {int} factor - How spread out the coordinates will be, the smaller the less separation
 * @returns {int} Vector3.z
 */
export const setZpos = (i, factor = 1) => {
  factor *= Math.ceil((i % 4 === 0 ? i + 1 : i) / 4);
  return i % 4 === 1 || i % 4 === 2 ? factor : -1 * factor;
};

/**
 * Javascript is a dynamically typed language.  This is the best utility method for catching inapropriate values.
 */
export const isNil = (value) =>
  value === undefined || value === null || Number.isNaN(value);

export const isNilorEmptyString = (value) => isNil(value) || value === '';

export const deepCopy = (collection) => {
  try {
    return JSON.parse(JSON.stringify(collection));
  } catch (e) {
    return null;
  }
};

// eslint-disable-next-line no-unused-vars
const isISOString = (str) => {
  if (typeof str !== 'string') return false;
  if (str.length < 24 || str.length > 27) return false;

  let dashCount = 0,
    colonCount = 0,
    periodCount = 0,
    zCount = 0;

  for (let e of str) {
    if (e === '-') {
      dashCount++;
    } else if (e === ':') {
      colonCount++;
    } else if (e === '.') {
      periodCount++;
    } else if (e === 'Z') {
      zCount++;
    }
  }

  if (
    dashCount === 2 &&
    colonCount === 2 &&
    periodCount === 1 &&
    zCount === 1
  ) {
    return true;
  } else {
    return false;
  }
};
