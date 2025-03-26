const express = require("express");

const User = require("../models/user.model");
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

//todo  forgetPassword api

module.exports = profileRouter;
