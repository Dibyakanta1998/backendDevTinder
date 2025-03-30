const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const User = require("./models/user.model");
const { userAuth } = require("./middlewares/auth.middleware");
const app = express();

app.use(express.json());
app.use(cookieParser());

const routes = require("./routes");

app.use("/", routes);

connectDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(3000, () => console.log("Server is running on port 3000 ...."));
  })
  .catch((err) => console.error("Database not connected", err.message));
