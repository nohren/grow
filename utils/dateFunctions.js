import date from 'date-and-time';
import { isNil, isNilorEmptyString } from './utils';

/**
 *  this function must be run in a useEffect where the window object is accessable.
 * @param {Record<string,any>[]}  Trees
 */
export const decayHabits = (habits) => {
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
 * Takes an object of habits, calculates the days since last decayed.  Takes into consider. If run each day should be 1.
 * Input
 * @param {Habit}
 * @return {Tree[]} - { id, daysDecayed: Number}
 */
const shrink = (habits) => {
  return habits
    .reduce((accumulator, currentValue) => {
      const { id, lastDecayedDate } = currentValue;
      const daysDecayed = Math.floor(
        date
          .subtract(
            new Date(),
            new Date(
              !isNil(lastDecayedDate) ? lastDecayedDate : Date.now() - dayInMs
            ) //if isNil, return timeStamp for yesterday. Shrink once and add a new decayTimeStamp in that context. For handling the edge case that one may not currently exist.
          )
          .toDays()
      );
      accumulator.push({
        id,
        daysDecayed,
      });
      return accumulator;
    }, [])
    .filter((event) => event.daysDecayed > 0);
};
export const stringToDateFormatter = (timeStamp) => {
  if (isNilorEmptyString(timeStamp)) {
    return '';
  }
  return date.format(new Date(timeStamp), 'ddd, MMM DD YYYY, h:mm A');
};

export const getCurrentTimeStamp = () => Date.now();

export const isToday = (timeStamp) =>
  date.isSameDay(new Date(timeStamp), new Date());

export const dayInMs = 1000 * 60 * 60 * 24;

export const weekInMs = 1000 * 60 * 60 * 24 * 7;
