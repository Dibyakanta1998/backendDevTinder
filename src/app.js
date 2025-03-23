//node v 20
const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  // request handler
  res.send("Hello from the server !!!");
});

app.listen(3000, () => console.log("Server is running on port 3000 ...."));
