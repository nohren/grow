//get the node module which is a class.
const mongoose = require('mongoose');

//runs a function to see if the mongoose class has an open connection, otherwise create one
export default async () => {
  if (mongoose.connection.readyState) return;
  //console.log('connection string: ', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('connected to database');
  } catch (e) {
    console.log('db error', e);
  }
};

// db.on('error', () => {
//   console.log('mongoose connection error');
// });

// db.once('open', () => {
//   console.log('mongoose connected successfully');
// });

// module.exports = db;
