const { Habit, Gfx, GfxIndex } = require('./gardenSchema');
//const db = require('./database')

const insertHabit = async (habit, gfx, cb) => {
  console.log(habit);
  try {
    //mongoose map convert number to string key
    const instance = new Habit({
      habit: habit.habit,
      treemoji: gfx.treemoji,
      path: gfx.path,
      dailyComplete: habit.dailyComplete,
      scale: gfx.scale,
      rate: gfx.rate,
      frequency: habit.frequency,
      description: habit.description,
      reps: habit.reps,
      startDate: habit.startDate,
      dateLastCompleted: habit.dateLastCompleted,
      initialScale: gfx.scale,
    });
    console.log(instance);
    const success = await instance.save();
    cb(success);
  } catch (e) {
    console.log(e);
  }
};

const getGfx = async (cb) => {
  try {
    let res = await Gfx.find();
    cb(res);
  } catch (e) {
    console.log(e);
  }
};

const getHabits = async (cb) => {
  try {
    const result = await Habit.find();
    let habits = {};
    for (let e of result) {
      let convert = {};
      for (let key of e.frequency) {
        convert[key[0]] = Boolean(key[1]);
      }
      let currentHabit = {
        id: e.id,
        habit: e.habit,
        treemoji: e.treemoji,
        path: e.path,
        dailyComplete: e.dailyComplete,
        scale: e.scale,
        rate: e.rate,
        frequency: convert,
        description: e.description,
        reps: e.reps,
        startDate: e.startDate,
        dateLastCompleted: e.dateLastCompleted,
        initialScale: e.initialScale,
      };
      habits[e.id] = currentHabit;
    }
    cb(habits);
  } catch (e) {
    console.log(e);
  }
};
const updateHabit = async (habit, cb) => {
  const filter = habit.id;
  const update = habit;
  try {
    let doc = await Habit.findByIdAndUpdate(filter, update);
    cb(null, doc);
  } catch (e) {
    console.log(e, null);
  }
};

const deleteHabit = async (id, cb) => {
  try {
    let doc = await Habit.findByIdAndDelete(id.id);
    cb(null, doc);
  } catch (e) {
    cb(e, null);
  }
};

const getIndex = async (cb) => {
  const doc = await GfxIndex.find();
  cb(doc[0]);
};

const updateIndex = async (newIndex, cb) => {
  // finds the only document
  const filter = {};
  const update = { index: newIndex };

  const doc = await GfxIndex.findOneAndUpdate(filter, update, {
    new: true,
  });
  if (cb) cb(doc);
};

//************************************************************* db ETL */

// const createIndex = async (current) => {
//    const instance = new GfxIndex({
//      index: current,
//    })
//    await instance.save();
// };

// const gfxObjects = [
//   {treemoji: '🌴', path: 'Palm.glb', scale: 0.18, rate: 0.001},
//   {treemoji: '🌲', path: 'Spruce.glb', scale: 0.25, rate: 0.001},
//   {treemoji: '🌵', path: 'Cactus.glb', scale: 0.3, rate: 0.001},
//   {treemoji: '🌳', path: 'dec.glb', scale: 0.3, rate: 0.001},
//   {treemoji: '🌺', path: 'Bush.glb', scale: 0.5, rate: 0.001}
// ];

// const loadGFXCollection = async (payload) => {
//   for (let gfx of payload) {
//     const instance = new Gfx({
//       treemoji: gfx.treemoji,
//       path: gfx.path,
//       scale: gfx.scale,
//       rate: gfx.rate
//     })
//     await instance.save();
//   }
//   createIndex(0);
// }
// loadGFXCollection(gfxObjects);
//   {treemoji: '🍁', path: 'fallingLeaves.glb', scale: 3, rate: 0.01},

module.exports = {
  getHabits,
  insertHabit,
  getGfx,
  updateHabit,
  updateIndex,
  getIndex,
  deleteHabit,
};

// const insertHabit = async (habit, cb) => {
//   try {
//     const habit

//     const updated = await obj.save()
//     cb(null, updated)
//   } catch (e) {
//     cb(e, null)
//   }
// }

// const insertAction = async (emotion, actionObj, cb) => {
//   // actionObj = {
//   //   action: 'Go for a walk in the morning',
//   //   helpfulness: 0,
//   //   dateAdded: new Date(),
//   //   timeRequired: 0
//   // }
//   try {
//   const obj = await Emotion.findOne({ emotion: emotion })
//   const actions = obj.actions;
//   actions.push(actionObj)

//   const updated = await obj.save()
//   cb(null, updated)
//   } catch(e) {
//     cb(e, null)
//   }
// }

// const postEmotion = async (emotion, cb) => {
// try{
//   const added = await emotion.save();
//   cb(null, added);
// } catch(e) {
//   cb(e, null)
// }
// }
