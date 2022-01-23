export const dateThreshold = (
  dateObject,
  daysToCount = 1,
  hourOfDay = 23,
  minuteOfDay = 59
) => {
  let threshold = new Date(dateObject.toString());
  threshold.setDate(threshold.getDate() + daysToCount);
  threshold.setHours(hourOfDay);
  threshold.setMinutes(minuteOfDay);
  return threshold;
};
