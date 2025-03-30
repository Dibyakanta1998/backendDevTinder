const express = require("express");

const { userAuth } = require("../middlewares/auth.middleware");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      status: "interested",
      toUserId: loggedInUser._id,
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);

    res.json({ message: "Data fetch successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) =>
      row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId
    );
    res.json({ message: "Data fetch successfully", data });
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = page - 1 * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersfromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersfromFeed.add(req.fromUserId.toString());
      hideUsersfromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      _id: { $nin: Array.from(hideUsersfromFeed) },
    })
      .skip(skip)
      .limit(limit)
      .select(USER_SAFE_DATA);

    res.json({
      data: users,
      message: "Data fetched successfully",
    });
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});
module.exports = userRouter;
