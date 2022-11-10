const mongoose = require('mongoose');

const databaseConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Mongodb database is connected');
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = databaseConnect;
