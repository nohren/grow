const mongoose = require('mongoose');

const habitSchema = mongoose.Schema({
    habit: String,
    treemoji: String,
    path: String,
    dailyComplete: Boolean,
    scale: Number,
    rate: Number,
    frequency: {
        type: Map,
        of: String
    },
    description: String,
    reps: Number,
    startDate: Date,
    dateLastCompleted: Date
})
//treemoji, path, scale, rate
const gfxSchema = mongoose.Schema({
    treemoji: String,
    path: String,
    scale: Number,
    rate: Number
})

const gfxIndex = mongoose.Schema({
    index: Number,
})



if (!mongoose.models.Habit) mongoose.model('Habit', habitSchema);
if (!mongoose.models.Gfx) mongoose.model('Gfx', gfxSchema);
if (!mongoose.models.GfxIndex) mongoose.model('GfxIndex', gfxIndex);
module.exports = {
    Habit: mongoose.models.Habit,
    Gfx: mongoose.models.Gfx,
    GfxIndex: mongoose.models.GfxIndex
};
