const { Habit, Gfx, GfxIndex } = require('./gardenSchema');

export const insertHabit = async (habit, gfx) => {
  // console.log(habit);
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
    //console.log(instance);
    return await instance.save();
  } catch (e) {
    return e;
  }
};

export const getGfx = async () => {
  try {
    return await Gfx.find();
  } catch (e) {
    return e;
  }
};

export const getHabits = async () => {
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
    return habits;
  } catch (e) {
    return e;
  }
};

export const updateHabit = async (habit) => {
  const filter = habit.id;
  const update = habit;
  try {
    return await Habit.findByIdAndUpdate(filter, update);
  } catch (e) {
    return e;
  }
};

export const deleteHabit = async (id) => {
  try {
    return await Habit.findByIdAndDelete(id.id);
  } catch (e) {
    return e;
  }
};

export const getIndex = async () => {
  try {
    //do not do any data shaping on a promise, wait until it resolves. Do the data shaping on the next line.
    const res = await GfxIndex.find();
    return res[0];
  } catch (e) {
    return e;
  }
};

export const updateIndex = async (newIndex) => {
  // finds the only document
  const filter = {};
  const update = { index: newIndex };
  try {
    return await GfxIndex.findOneAndUpdate(filter, update, {
      new: true,
    });
  } catch (e) {
    return e;
  }
};

//************************************************************* db ETL */

// const createIndex = (current) => {
//   const instance = new GfxIndex({
//     index: current,
//   });
//   try {
//     //returns a promise, once this finishes, the promise resolves or is rejected,
//     //if rejected we will see it on the catch block of the main.js then
//     //return returns the value in the promise to the then block like a res() would.
//     //otherwise control is handed to the then block when the promise resolves.

//     //no matter what happens within an async function, it will immediately return a promise
//     //you must await it or then it outside of this context.

//     return instance.save();
//     //return 'Created db index';
//   } catch (e) {
//     return e;
//   }
// };

// const gfxObjects = [
//   { treemoji: '🌴', path: 'Palm.glb', scale: 0.18, rate: 0.001 },
//   { treemoji: '🌲', path: 'Spruce.glb', scale: 0.25, rate: 0.001 },
//   { treemoji: '🌵', path: 'Cactus.glb', scale: 0.3, rate: 0.001 },
//   { treemoji: '🌳', path: 'dec.glb', scale: 0.3, rate: 0.001 },
//   { treemoji: '🌺', path: 'Bush.glb', scale: 0.5, rate: 0.001 },
// ];

// const loadGFXCollection = async (payload) => {
//   const gfxs = [];
//   for (let gfx of payload) {
//     const instance = new Gfx({
//       treemoji: gfx.treemoji,
//       path: gfx.path,
//       scale: gfx.scale,
//       rate: gfx.rate,
//     });
//     gfxs.push(instance.save());
//   }
//   try {
//     await Promise.all(gfxs);
//     await createIndex(0);
//     return 'finished ETL process';
//   } catch (e) {
//     return e;
//   }
// };
// const db = require('./database');
// db().then((res) =>
//   loadGFXCollection(gfxObjects).then((res) => console.log(res))
// );
//{treemoji: '🍁', path: 'fallingLeaves.glb', scale: 3, rate: 0.01},

// module.exports = {
//   getHabits,
//   insertHabit,
//   getGfx,
//   updateHabit,
//   updateIndex,
//   getIndex,
//   deleteHabit,
// };

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
