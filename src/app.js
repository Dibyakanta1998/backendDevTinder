const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/database");
const routes = require("./routes");
const initializeSocket = require("./utils/socket");
require("./utils/cronJob");

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database is connected");
    server.listen(3000, () =>
      console.log("Server is running on port 3000 ....")
    );
  })
  .catch((err) => console.error("Database not connected", err.message));
