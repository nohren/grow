import { shrinkTrees } from '../../helpers/dateFunctions';

/*
  Function adds a recurring event loop timer to the window object. Checks once per minute, 60 times per hour and 1440 times per day for midnight.
  At midnight, all trees are checked for shrinkage and shrinked accordingly.  That is if the browser is open then.  Otherwise it is taken care of on browser load.  Using both methods in tandem will not conflict as they both update the dateLastCompleted date. Which they both go off of.
  
  For continuously running machines such as those in kiosk mode, this will be the relied upon method of shrinking habits.
*/

export const timeKeeper = (compoundFactor, habits) => {
  //create a date at midnight tomrrow to check against
  //const timeToReference = createFutureDate();

  let armed = true;
  return setInterval(() => {
    const now = new Date();
    //console.log('Time Reference', timeToReference);
    console.log('current time', now);
    if (now.getHours() === 21 && now.getMinutes() === 20) {
      //FireOff and reset dateCheck to next days midnight
      if (armed) {
        const trees = Object.values(habits.current);
        shrinkTrees(trees, compoundFactor);
        armed = false;
      }
      //timeToReference = createFutureDate(timeToReference);
    } else {
      if (!armed) {
        armed = true;
      }
    }
  }, 30000);
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
