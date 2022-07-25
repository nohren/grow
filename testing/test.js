let repFactor = 1;

/**
 * slide y calculations to the right 1, allows for a 0,0 origin
 *
 */
const getY = (x) => Math.log2(x + 1);

const growX = (x) => x + 1;

const decayX = (x, daysDecayed, daysGrown, decayFactor) =>
  x * (1 - decayFactor * (daysDecayed - daysGrown));

console.log(getY(repFactor)); // y at one rep

console.log(decayX(1, 1, 0, 0.2)); //one rep on one day, one decay the next day
console.log(repFactor * 0.8, ' test new rep factor'); // test

repFactor = decayX(1, 1, 0, 0.2);

console.log(getY(repFactor), ' y'); // y at one rep on one day, one decay

console.log(decayX(repFactor, 3, 0, 0.2)); //one rep on one day, one decay the next, then not persisted for three days, I was on vacation and computer off,
console.log(repFactor * (1 - 0.2 * 3), ' test new rep factor'); // test

repFactor = decayX(repFactor, 3, 0, 0.2);

console.log(getY(repFactor), ' y'); //  // y at one rep on one day, one decay, then not persisted for three days, I was on vacation and computer off,

console.log(decayX(repFactor, 3, 3, 0.2)); // did not persist for 3 days, also grew for three days, just updated on the mobile app but never refreshed and iphone browser was not in focus at midnight.
console.log(repFactor * (1 - 0.2 * (3 - 3)), ' test new rep factor'); // test

console.log(getY(repFactor), ' y');

repFactor = 0;
console.log('starting rep factor at: ', repFactor);

for (let i = 0; i < 32; i++) {
  console.log(`x: ${repFactor} y: ${getY(repFactor)}`);
  repFactor = growX(repFactor);
}
