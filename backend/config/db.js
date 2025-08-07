const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected`.green.bold);
    console.log(`${process.env.MONGO_URI}`.blue.underline);
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
