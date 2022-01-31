//this function must be run in a useEffect where the window object is accessable.
//it takes in an array of tree objects
export const shrinkTrees = (trees, compoundFactor) => {
  const shrinkList = treesToShrink(trees, compoundFactor);
  shrinkList.map((tree) => {
    //await R3F canvas mount. Due to webGL? need to wait about 500ms longer after "mount".
    //Deduced by moving through the logical assumption that after render, useEffect hook is called thus render should be complete. And by dispatching events manually in the chrome console on load I saw they weren't triggering the listener until a little after mount.  So setTimeout was the next natural step. Utilizing the event loop.
    setTimeout(() => {
      const { id, newScale } = tree;
      window.dispatchEvent(
        new CustomEvent('shrink', {
          detail: { id, newScale },
        })
      );
    }, 3000);
  });
};

const treesToShrink = (trees, compoundFactor) => {
  return trees
    .map((tree) => {
      return getShrinkData(tree, compoundFactor);
    })
    .filter(({ newScale }) => newScale > 0);
};

const getShrinkData = (
  { dateLastCompleted, frequency, id, scale },
  compoundFactor
) => {
  const data = { id, newScale: 0 };
  if (Object.keys(frequency).length === 0) return data;
  const deltaDays = computeDays(
    new Date() -
      dateDelinquencyThreshold(
        dateLastCompleted,
        nextComplete(dateLastCompleted, frequency)
      )
  );
  // console.log(
  //   'next complete day count',
  //   nextComplete(dateLastCompleted, frequency)
  // );
  // console.log('scale', scale);
  // console.log('days', deltaDays);
  // console.log(1 - compoundFactor);
  if (deltaDays > 0) {
    data.newScale = scale * (1 - compoundFactor) ** deltaDays;
  }
  return data;
};

const nextComplete = (dateLastCompleted, frequency) => {
  const days = [0, 1, 2, 3, 4, 5, 6];
  const lc = dateLastCompleted.getDay();
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

// console.log(
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
