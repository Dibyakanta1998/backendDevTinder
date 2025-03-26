const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is invalid");
    }
    const decodedObj = await jwt.verify(token, "DEV@Tinder@1979");

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + error.message);
  }
};

module.exports = {
  userAuth,
};
