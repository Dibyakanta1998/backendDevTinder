const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dibyakanta9937:ybdNLSlwpr0QKFAs@dibyakantmicroservice.b6ucm.mongodb.net/devTinder"
  );
};

module.exports=connectDB


