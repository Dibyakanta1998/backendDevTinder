const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) throw new Error("Invalid Credentials !!!");

    const isPasswordValid = await user.passwordValidation(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials !!!");
    }
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("Logout  Successful");
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + error.message);
  }
});

module.exports = authRouter;
