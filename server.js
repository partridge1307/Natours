const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (error) => {
  console.log(`${error.name}: ${error.message}`);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
  } catch (error) {
    console.log(error.message);
  }
})();

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (reason) => {
  console.log(`${reason.name} : ${reason.message}`);

  server.close(() => {
    process.exit(1);
  });
});
