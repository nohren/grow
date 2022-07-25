const mongoose = require('mongoose');

/**
 * persisted habit data
 */
const habitSchema = mongoose.Schema({
  name: String, //name of habit
  treemoji: String, //tree emoji image
  path: String, //path of Graphics Library transmission binary file containing 3D data for R3F
  frequency: [Number], // habit occurence goals per 7 days.  May eventually be used to set calendar reminders.
  description: String, // description of the habit in users own words
  reps: Number, // habit repetitions
  repsAdjusted: Number, // repetitions adjusted for time decay, the principle measure of the application.
  startDate: Number, // habit creation timestamp
  lastCompleted: Number, //last habit occurence timestamp, used to show user when it was last done.
  lastDecayed: Number, // last habit decay timestamp, used to derive the amount of decay days in the current decay persisting operation.
  repsGoal: Number, // repsAdjusted goal for automaticity completion. Used to show progress towards the goal as a % of reps.
  repsSinceDecay: [Number], //a cache of timestamps representing reps since last decayed date.  Cleared during a decay persistence operation. Used to get daysGrown to match against daysDecayed
});
//removes _id and adds id.
habitSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
//treemoji, path, scale, rate
const gfxSchema = mongoose.Schema({
  treemoji: String,
  path: String,
  scale: Number,
});

const gfxIndex = mongoose.Schema({
  index: Number,
});

if (!mongoose.models.Habit) mongoose.model('Habit', habitSchema);
if (!mongoose.models.Gfx) mongoose.model('Gfx', gfxSchema);
if (!mongoose.models.GfxIndex) mongoose.model('GfxIndex', gfxIndex);
module.exports = {
  Habit: mongoose.models.Habit,
  Gfx: mongoose.models.Gfx,
  GfxIndex: mongoose.models.GfxIndex,
};
