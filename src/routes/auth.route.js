const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const { validateSignUpData } = require("../utils/validation");
const keys = require("../../dev_tinder_oauth.json");
const oAuth2Client = require("../config/googleOAuth");
const { WEB_URL } = require("../config/constants");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      skills,
      photoUrl,
      age,
      gender,
    } = req.body;

    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      skills,
      photoUrl,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "User added successfully", data: savedUser });
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
      res.send(user);
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

authRouter.get("/google/login", async (req, res) => {
  try {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    res.redirect(authorizeUrl);
  } catch (err) {
    res.sendStatus(400).send("Something went wrong !!!", err.message);
  }
});

authRouter.get("/googleOAuth/callback", async (req, res) => {
  try {
    const { code } = req.query;
    console.log(code);

    const { tokens } = await oAuth2Client.getToken(code);

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: keys.web.client_id,
    });

    const payload = ticket.getPayload();

    const userPayload = {
      emailId: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
    };

    if (!userPayload.emailId)
      throw new Error("Email is not associated with the account !!!");

    let user = await User.findOne({
      emailId: payload.email,
    });

    if (!user) {
      user = new User(userPayload);
      await user.save();
    }
    const token = await user.getJWT();

    res.cookie("token", token).redirect(WEB_URL + "/profile");
  } catch (err) {
    res.sendStatus(400).send("Something went wrong !!!", err.message);
  }
});
module.exports = authRouter;
