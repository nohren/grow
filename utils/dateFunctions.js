import date from 'date-and-time';
import { isNil, isNilorEmptyString } from './utils';

export const timePoll = (habitRef) => {
  const habits = habitRef.current;
  const habitArray = Object.values(habits ?? {});
  console.log('Checking time', new Date());
  if (habitArray.some((habit) => !isToday(habit.lastDecayed))) {
    decayHabits(habits);
  }
};
/**
 *  this function must be run in a useEffect where the window object is accessable.
 */
export const decayHabits = (habits) => {
  if (isNil(habits)) {
    return;
  }
  const shrinkList = shrink(habits);
  console.log('Habits to shrink: ', shrinkList);

  shrinkList.map((habit) => {
    //await R3F canvas mount. Due to webGL? need to wait about 500ms longer after "mount".
    //Deduced by moving through the logical assumption that after render, useEffect hook is called thus render should be complete. And by dispatching events manually in the chrome console on load I saw they weren't triggering the listener until a little after mount.  So setTimeout was the next natural step. Utilizing the event loop.

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('shrink', {
          detail: habit,
        })
      );
    }, 3000);
  });
};

/**
 * Takes an object of habits, calculates the days since last decayed, and grown.  Takes into consider. If run each day should be 1.
 * Input
 * @param {Habit}
 * @return {Tree[]} - { id, daysDecayed: Number}
 */
const shrink = (habits) => {
  return Object.values(habits)
    .reduce((accumulator, currentValue) => {
      const { id, lastDecayed, repsSinceDecay } = currentValue;
      const daysDecayed = decayCount(lastDecayed);
      const daysGrown = dayCount(repsSinceDecay);
      accumulator.push({
        id,
        daysDecayed,
        daysGrown,
      });
      return accumulator;
    }, [])
    .filter((obj) => obj.daysDecayed > 0); //if last decayed is todays date, then we don't trigger an event for that.
};
export const dateToStringFormatter = (timeStamp) => {
  if (isNilorEmptyString(timeStamp)) {
    return '';
  }
  return date.format(new Date(timeStamp), 'ddd, MMM DD YYYY, h:mm A');
};

export const monthDayYearFormatter = (timeStamp) => {
  if (isNilorEmptyString(timeStamp)) {
    return '';
  }
  return date.format(new Date(timeStamp), 'MMM DD YYYY');
};

const dayCount = (timeStampArray) => {
  const set = new Set();
  for (let i = 0, l = timeStampArray.length; i < l; i++) {
    set.add(monthDayYearFormatter(timeStampArray[i]));
  }
  return set.size;
};

const decayCount = (lastDecayed) => {
  return Math.floor(
    date
      .subtract(
        new Date(),
        new Date(!isNil(lastDecayed) ? lastDecayed : Date.now() - dayInMs) //if isNil, return timeStamp for yesterday. Shrink once and add a new decayTimeStamp in that context. For handling the edge case that one may not currently exist.
      )
      .toDays()
  );
};

export const getCurrentTimeStamp = () => Date.now();

export const isToday = (timeStamp) =>
  date.isSameDay(new Date(timeStamp), new Date());

export const isHour = (hour) => hour === new Date().getHours();

export const dayInMs = 1000 * 60 * 60 * 24;

export const weekInMs = 1000 * 60 * 60 * 24 * 7;
