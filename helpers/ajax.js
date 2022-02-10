import axios from 'axios';
const server = '/api';

export const createHabit = async (habit) => {
  try {
    const res = await axios.post(server + '/habit', habit);
    return res;
  } catch (e) {
    return e;
  }
};

export const getHabits = async () => {
  try {
    const res = await axios.get(server + '/habits');
    let array = Object.keys(res.data);
    for (let key of array) {
      res.data[key].startDate = new Date(res.data[key].startDate);
      res.data[key].dateLastCompleted = new Date(
        res.data[key].dateLastCompleted
      );
    }
    return res;
  } catch (e) {
    return e;
  }
};

export const updateHabit = async (habit) => {
  try {
    const res = await axios.put(server + '/habit', habit);
    return res;
  } catch (e) {
    return e;
  }
};

export const updateHabits = async (arrayOfHabits) => {
  const promiseArray = [];
  for (let habit of arrayOfHabits) {
    promiseArray.push(updateHabit(habit));
  }
  try {
    return await Promise.all(promiseArray);
  } catch (e) {
    return e;
  }
};

export const deleteHabit = async (habitId) => {
  try {
    const res = await axios.delete(server + '/habit', {
      data: { id: habitId },
    });
    return res;
  } catch (e) {
    return e;
  }
};
