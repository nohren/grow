//handle date strings
export const deepCopy = (collection) => {
  const isISOString = (str) => {
    if (typeof str !== 'string') return false;
    if (str.length < 24 || str.length > 27) return false;

    let dashCount = 0;
    let colonCount = 0;
    let periodCount = 0;
    let zCount = 0;

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

  return JSON.parse(JSON.stringify(collection), (key, value) => {
    if (isISOString(value)) {
      return new Date(value);
    } else {
      return value;
    }
  });
};
