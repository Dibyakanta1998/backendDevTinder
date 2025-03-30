const express = require("express");

const { userAuth } = require("../middlewares/auth.middleware");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const toUserId = req.params.toUserId;
      const fromUserId = user._id;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request already existed !!!",
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found !!!");
      }

      const data = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      await data.save();
      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (error) {
      res.status(400).send("Something went wrong:" + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const toUserId = user.toUserId;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({
          message: "Connection Request not found !!!",
        });
      }

      existingConnectionRequest.status = status;
      const data = await existingConnectionRequest.save();

      res.json({
        message: "Connection request" + status + "successfully ",
        data,
      });
    } catch (error) {
      res.status(400).send("Something went wrong:" + error.message);
    }
  }
);
module.exports = requestRouter;
