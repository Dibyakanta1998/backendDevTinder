const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const connectDB = require("./config/database");
const User = require("./models/user.model");
const { validateSignUpData } = require("./utils/validation");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser);

app.post("/signup", async (req, res) => {
  console.log("🚀 ~ app.post ~ req:", req);
  try {
    //Validation of data
    const { firstName, lastName, emailId, password } = req.body;

    validateSignUpData(req);
    //Encrypt password

    const passwordHash = await bcrypt.hash(password, 10);
    //save the user

    // const userObj = req.body;
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    console.log("comee");

    await user.save();
    console.log("come");
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    //Validation of data
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) throw new Error("Invalid Credentials !!!");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create a jwt token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder@1979");

      //add the jwt token to cookie and send it to the user
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials !!!");
    }

    // validateSignUpData(req);
    //Encrypt password

    // const passwordHash = await bcrypt.hash(password, 10);
    //save the user

    // const userObj = req.body;
    // const user = new User({
    //   firstName,
    //   lastName,
    //   emailId,
    //   password: passwordHash,
    // });
    // await user.save();
    // res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else res.send(user);
  } catch (e) {
    res.status(400).send("Something went wrong !!!");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userid;
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (e) {
    res.status(400).send("Something went wrong !!!");
  }
});

app.patch("/user?:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) throw new Error("Update not allowed");
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (e) {
    res.status(400).send("Something went wrong !!!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (e) {
    res.status(400).send("Something went wrong !!!");
  }
});

app.get("/profile", async (req, res) => {
  const cookie = req.cookies;
  const { token } = cookie;
  const decodedValue = jwt.verify(token, "DEV@Tinder@1979");
  const { _id } = decodedValue;

  res.send("Cookie");

  // console.log(cookie);
});

connectDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(3000, () => console.log("Server is running on port 3000 ...."));
  })
  .catch((err) => console.error("Database not connected", err.message));
