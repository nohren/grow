const mongoose = require('mongoose');

//runs a function to see if the mongoose class has an open connection, otherwise create one

// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
  if (mongoose.connection.readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('connected to database');
  } catch (e) {
    console.log('db error', e);
  }
};
