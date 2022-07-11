import { decayHabitTrees } from '../../utils/dateFunctions';
import { updateHabit } from '../../utils/network';

/**
 * Function adds a recurring event loop timer to the window object. Checks once every 60 seconds for midnight.
   At midnight, all trees are checked for completion and neuron decay process starts otherwise.  That is if the browser is open then.  Otherwise it is taken care of on browser load.  
 */
export const timeKeeper = (decayRate, habits, getHabitsAndSet) => {
  let armed = true;
  return setInterval(() => {
    const now = new Date();
    console.log('current time', now);

    if (now.getHours() === 0) {
      if (armed) {
        const trees = Object.values(habits.current);
        decayHabitTrees(trees, decayRate);
        uncheckHabits(habits.current, getHabitsAndSet);
        armed = false;
      }
    } else {
      if (!armed) {
        armed = true;
      }
    }
  }, 60000);
};

const uncheckHabits = async (habits, getHabitsAndSet) => {
  const habitList = Object.values(habits);
  const updatePromises = [];
  for (let habit of habitList) {
    const copy = { ...habit };
    copy.dailyComplete = false;
    updatePromises.push(updateHabit(copy));
  }
  try {
    await Promise.all(updatePromises);
    getHabitsAndSet();
  } catch (e) {
    console.log(e);
  }
};

//given a date, returns a new date tomorrow, or can customize it with parameters
const createFutureDate = (
  date = new Date(),
  days = 1,
  hours = 0,
  minutes = 0,
  seconds = 0
) => {
  const dateCopy = new Date(date.toString());
  dateCopy.setDate(dateCopy.getDate() + days);
  dateCopy.setHours(hours);
  dateCopy.setMinutes(minutes);
  dateCopy.setSeconds(seconds);
  return dateCopy;
};
