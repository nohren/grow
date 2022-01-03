import axios from "axios";
const server = '/api';
//CRUD - create, read, update, delete

const createHabit = async (habit, cb) => {
  try {
    const res = await axios.post(server + '/habit', habit) 
    cb(res);
  }
  catch(e){
      console.log(e)
  }
}

const getHabits = async (cb) => {
    try {
      const res = await axios.get(server + '/habits');
      let array = Object.keys(res.data)
      for (let key of array) {
        res.data[key].startDate = new Date(res.data[key].startDate);
        res.data[key].dateLastCompleted = new Date(res.data[key].dateLastCompleted);
      }
      cb(res)
    }
    catch(e){
        console.log(e)
    }
}

const updateHabit = async (habit, cb) => {
  try {
    const res = await axios.put(server + '/habit', habit);
    cb(null, res);
  }catch(e) {
    cb(e, null);
  }
}

const deleteHabit = async (habitId, cb) => {
  try {
    const res = await axios.delete(server + '/habit', {data: {id: habitId}})
    cb(null, res);
  } catch(e) {
    cb(e, null);
  }
}

module.exports = {
    createHabit,
    getHabits,
    updateHabit,
    deleteHabit
}