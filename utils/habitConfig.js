/**
 * Habit Config object - all the equations and constants are in one place.  This is a singleton object, the this context will allow these methods to point back to the constants.  One place to edit.
  
  Premise:
  x - number of habit repetitions total (is constantly adjusted for time decay)
  Automaticity - y, a function of x.  Y is defined as the base 2 logarithm of x, moved to the right one unit to allow a 0,0 origin.

  We only deal with x.  Increment it or decay it. 
  Again, y is a function of x.
*/

const habitConfig = {
  animationRate: 0.004,
  repUnits: 1, //amount of reps per occurence
  decayFactor: 2 / 7, // 2 reps gone every 7 days without new reps
  repsGoal: 31,
  getX: function (y) {
    return 2 ** y - 1;
  },
  /**
   * base 2 logarithm. x moved right once to allow a 0,0 origin
   */
  getY: function (x) {
    return Math.log2(x + 1);
  },
  growX: function (x) {
    return x + this.repUnits;
  },
  /**
   * Intended to model decay of x linearly. We eat up a rep every 1 / decayFactor days.
   */
  decayX: function (x, daysDecayed, daysGrown) {
    return x - this.decayFactor * (daysDecayed - daysGrown);
  },
  calculateProgress: function (x) {
    return ((this.getY(x) / this.repsGoal) * 100).toFixed(2) + '%';
  },
};

export default habitConfig;
