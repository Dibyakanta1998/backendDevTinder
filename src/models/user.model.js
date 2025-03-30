const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Please enter valid email");
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "${VALUE} is not supported",
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) throw new Error("Invalid photo url.i");
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
      validate(value) {
        console.log("🚀 ~ validate ~ value:", value);
        if (value.length > 1) {
          throw new Error("Skills cannot be more than 10");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  firstName: 1,
  lastName: 1,
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder@1979", {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.passwordValidation = async function (passwordInputByUser) {
  const user = this;

  return bcrypt.compare(passwordInputByUser, user.password);
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
