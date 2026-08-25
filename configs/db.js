const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    if (mongoose.connection.readyState) return true;
    else {
      await mongoose.connect(process.env.MONGO_URI, {
        retryWrites: false,
      });
      console.log("DB connected successfully");
    }
  } catch (error) {
    console.log("Error in connect to DB: ", error);
  }
};
module.exports = connectToDB;
