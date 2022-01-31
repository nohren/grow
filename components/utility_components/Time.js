import { shrinkTrees } from '../../helpers/dateFunctions';

/*
  Function adds a recurring event loop timer to the window object. Checks once per minute, 60 times per hour and 1440 times per day for midnight.
  At midnight, all trees are checked for shrinkage and shrinked accordingly.  That is if the browser is open then.  Otherwise it is taken care of on browser load.  Using both methods in tandem will not conflict as they both update the dateLastCompleted date. Which they both go off of.
  
  For continuously running machines such as those in kiosk mode, this will be the relied upon method of shrinking habits.
*/

export const timeKeeper = (compoundFactor, habits) => {
  const interval = 30000;

  //test in minutes

  //create midnight date to check against
  const timeToReference = createFutureDate();

  return setInterval(() => {
    const now = new Date();
    //console.log('Time Reference', timeToReference);
    //console.log('curent time', now);

    if (
      now.getHours() === timeToReference.getHours() &&
      now.getMinutes() === timeToReference.getMinutes()
    ) {
      //FireOff and reset dateCheck to next days midnight
      const trees = Object.values(habits.current);
      shrinkTrees(trees, compoundFactor);
      timeToReference = createFutureDate(timeToReference, 1);
    }
  }, interval);
};

//given a date, creates a new date sometime in the future
const createFutureDate = (
  date = new Date(),
  days = 0,
  hours = 23,
  minutes = 59,
  seconds = 59
) => {
  const dateCopy = new Date(date.toString());
  dateCopy.setDate(dateCopy.getDate() + days);
  dateCopy.setHours(hours);
  dateCopy.setMinutes(minutes);
  dateCopy.setSeconds(seconds);
  return dateCopy;
};
