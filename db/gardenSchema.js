const mongoose = require('mongoose');

/**
 * unless otherwise noted, habits are represented as trees and are synonymous with them in this app.  The goal with this appis that they will grow unconsciously.
 */
const habitSchema = mongoose.Schema({
  name: String, //name of habit
  treemoji: String, //tree emoji image
  path: String, //path of Graphics Library transmission binary file containing 3D data for R3F
  scale: Number, // The current size of the habit object
  frequency: [Number], // habit occurence goals per 7 days
  description: String, // description of the habit in users own words
  reps: Number, // habit occurences since creation
  startDate: Number, // habit creation timestamp
  lastCompletedDate: Number, //last habit occurence timestamp
  lastDecayedDate: Number, // last habit neuron decay timestamp
  initialScale: Number, // starting scale of habit object, used to calculate compounding growth over time
});
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
