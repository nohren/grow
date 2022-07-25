import { decayHabits } from '../../utils/dateFunctions';

/**
 * function polls every 60 seconds for midnight.
   At midnight, all trees are checked for completion and neuron decay process starts otherwise.  That is if the browser is open then.  Otherwise it is taken care of on next browser load or midnight, whichever comes first..  
 */
export const timePolling = (habits) => {
  let armed = true;
  return setInterval(() => {
    const now = new Date();
    console.log('current time', now);

    if (now.getHours() === 0) {
      if (armed) {
        decayHabits(habits);
        armed = false;
      }
    } else {
      if (!armed) {
        armed = true;
      }
    }
  }, 60000);
};
