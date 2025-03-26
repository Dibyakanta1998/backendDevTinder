const express = require("express");
const cookieParser = require("cookie-parser");
// const cors = require("cors");

const connectDB = require("./config/database");
const User = require("./models/user.model");
const { userAuth } = require("./middlewares/auth.middleware");
const app = express();
// app.use(cors());

app.use(express.json());
app.use(cookieParser());

const routes = require("./routes");

app.use("/", routes);

// app.get("/user", async (req, res) => {
//   try {
//     const userEmail = req.body.emailId;
//     const user = await User.find({ emailId: userEmail });
//     if (user.length === 0) {
//       res.status(404).send("User not found");
//     } else res.send(user);
//   } catch (e) {
//     res.status(400).send("Something went wrong !!!");
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     const userId = req.body.userid;
//     await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully");
//   } catch (e) {
//     res.status(400).send("Something went wrong !!!");
//   }
// });

// app.patch("/user?:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const data = req.body;

//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) throw new Error("Update not allowed");
//     await User.findByIdAndUpdate(userId, data, {
//       runValidators: true,
//     });
//     res.send("User updated successfully");
//   } catch (e) {
//     res.status(400).send("Something went wrong !!!");
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const user = await User.find({});
//     res.send(user);
//   } catch (e) {
//     res.status(400).send("Something went wrong !!!");
//   }
// });

// app.post("/connectionRequest", userAuth, async (req, res) => {
//   const user = req.user;
//   res.send(user + "sent this connection request");
// });

connectDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(3000, () => console.log("Server is running on port 3000 ...."));
  })
  .catch((err) => console.error("Database not connected", err.message));
