/**
 * Given a current scale and an initial scale, reflects the percentage increase over time given compounding.  Amount of increase generally reflects amount of compounding.  The larger the value the more automatic the response or habit.
 * @param {*} current size.
 * @param {*} initial size
 * @returns
 */
export const calculateScore = (current, initial) => {
  return (((current - initial) / current) * 100).toFixed(1) + '%';
};

//not sure what the thoughts behind this was, I never documented it
// return ((current / initial - 1) * 100).toFixed(2) + '%';

//modulo and division is better thoguht of as how do we get from bottom number to top number using multiples of bottom number.  i.e 6/4 = 1.5 or one 4 + 2
// 6%4 = 2 or 4*1 + 2.
// 2/4 = 0.5 or 2%4 = 2 or 4 * 0 + 2
//commonality is multiple of 4,i.e 4 is remainder 0 so +, 5 is remainder 1 so +, 6 remainder 2 -, 7 remainder 3 -
//i % 4, 0 && 1 +, 2 && 3 -
//how do we know to double the factor, this is acheived by math.ceiling, if i is a factor of 4, then increment i to use
/**
 *
 * @param {*} i int - array index
 * @param {*} factor int - How spread out the coordinates will be, the smaller the less separation
 * @returns
 */
export const setXpos = (i, factor = 1) => {
  factor *= Math.ceil((i % 4 === 0 ? i + 1 : i) / 4);
  return i % 4 === 0 || i % 4 === 1 ? factor : -1 * factor;
};
/**
 *
 * @param {*} i
 * @param {*} factor - How spread out the coordinates will be, the smaller the less separation
 * @returns
 */
export const setZpos = (i, factor = 1) => {
  factor *= Math.ceil((i % 4 === 0 ? i + 1 : i) / 4);
  return i % 4 === 1 || i % 4 === 2 ? factor : -1 * factor;
};

/**
 * Use for possible undefined, null or NaN values
 * @param {*} value unknown
 * @returns boolean
 */
export const isNil = (value) => {
  return value === undefined || value === null || value === NaN;
};
