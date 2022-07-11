import date from 'date-and-time';
import { isNilorEmptyString } from './utils';

/**
 *  this function must be run in a useEffect where the window object is accessable.
 * @param {Record<string,any>[]}  Trees
 * @param {number} decayFactor
 */
export const decayHabitTrees = (trees, decayFactor) => {
  const shrinkList = treesToShrink(trees, decayFactor);
  console.log('Trees to shrink: ', shrinkList);
  shrinkList.map((tree) => {
    //await R3F canvas mount. Due to webGL? need to wait about 500ms longer after "mount".
    //Deduced by moving through the logical assumption that after render, useEffect hook is called thus render should be complete. And by dispatching events manually in the chrome console on load I saw they weren't triggering the listener until a little after mount.  So setTimeout was the next natural step. Utilizing the event loop.

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('shrink', {
          detail: tree,
        })
      );
    }, 3000);
  });
};

const treesToShrink = (trees, decayFactor) => {
  return trees
    .map((tree) => {
      return getShrinkData(tree, decayFactor);
    })
    .filter(({ newScale }) => newScale > 0);
};

/**
 *
 * @param {*} param0
 * @param {*} decayFactor
 * @returns
 */
const getShrinkData = (tree, decayFactor) => {
  const { lastCompletedDate, frequency, id, scale, initialScale } = tree;
  const data = { id, newScale: 0 };
  if (Object.keys(frequency).length === 0) return data;
  const deltaDays = Math.ceil(
    computeDays(
      new Date() -
        dateDelinquencyThreshold(
          lastCompletedDate,
          nextComplete(lastCompletedDate, frequency)
        )
    )
  );

  /*
  testing cases
  newScale = 0 // habit is not due, don't change scale
  newScale > 0 && newScale > initialScale // habit is due, shrink

  newScale > 0 && newScale < initialScale //habit is due, but will shrink tree smaller than when it started.  This habit is has been broken.  For better or worse.
  newScale = 0 and scale < initialScale, set scale to initialscale, we went too far
  */
  if (deltaDays > 0) {
    data.newScale =
      scale * (1 - decayFactor) ** deltaDays > initialScale
        ? scale * (1 - decayFactor) ** deltaDays
        : initialScale;
    data.newScale = scale === data.newScale ? 0 : data.newScale;
  }
  return data;
};

const nextComplete = (dateLastCompleted, frequency) => {
  const days = [0, 1, 2, 3, 4, 5, 6];
  const lc = dateLastCompleted?.getDay?.();
  let count = 0;
  for (let i = lc + 1; i < days.length; i++) {
    count++;
    if (frequency[i]) {
      return count;
    }
  }
  //go back around if needed
  for (let i = 0; i < lc + 1; i++) {
    count++;
    if (frequency[i]) {
      return count;
    }
  }
};

const computeDays = (ms) => {
  return ms / 1000 / 60 / 60 / 24;
};

const dateDelinquencyThreshold = (
  lastComplete,
  daysToNextComplete = 1,
  hourOfDay = 23,
  minuteOfDay = 59
) => {
  let threshold = new Date(lastComplete.toString());
  threshold.setDate(threshold.getDate() + daysToNextComplete);
  threshold.setHours(hourOfDay);
  threshold.setMinutes(minuteOfDay);
  return threshold;
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

//console.log(
//   getShrinkData(
//     {
//       dateLastCompleted: new Date(
//         'Jan 23 2022 21:12:28 GMT-0800 (Pacific Standard Time)'
//       ),
//       frequency: { 5: true },
//       id: 'ofjas89',
//       scale: 2,
//     },
//     1.2
//   )
// );
