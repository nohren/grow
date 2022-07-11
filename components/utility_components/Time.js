import { decayHabits } from '../../utils/dateFunctions';

/**
 * Function adds a recurring event loop timer to the window object. Checks once every 60 seconds for midnight.
   At midnight, all trees are checked for completion and neuron decay process starts otherwise.  That is if the browser is open then.  Otherwise it is taken care of on browser load.  
 */
export const timeKeeper = (habits) => {
  let armed = true;
  return setInterval(() => {
    const now = new Date();
    console.log('current time', now);

    if (now.getHours() === 0) {
      if (armed) {
        decayHabits(Object.values(habits.current));
        armed = false;
      }
    } else {
      if (!armed) {
        armed = true;
      }
    }
  }, 60000);
};
