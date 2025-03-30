const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth.middleware");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    validateEditProfileData(req);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} ,your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { prevPassword, newPassword } = req.body;

    const isPasswordValid = await user.passwordValidation(prevPassword);
    if (!isPasswordValid) throw new Error("Invalid credentials ");

    const isStrongPassword = validator.isStrongPassword(newPassword);
    if (!isStrongPassword) throw new Error("Please provide a strong password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send("Something went wrong !!!" + err.message);
  }
});

module.exports = profileRouter;
