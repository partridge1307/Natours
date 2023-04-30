const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: '../../config.env' });

(async () => {
  try {
    await mongoose
      .connect(process.env.DATABASE)
      .then(() => console.log('DATABASE connection successful!'));
  } catch (error) {
    console.log(error.message);
  }
})();

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

//Import
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Successful imported');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//Delete

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Successful deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const processArgument = process.argv[2];

if (processArgument === '--import') importData();
else if (processArgument === '--delete') deleteData();
