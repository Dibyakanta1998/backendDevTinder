const authRoutes = require("./auth.route");
const profileRoutes = require("./profile.route");
const requestRouter = require("./request.route");
const userRouter = require("./user.route");

module.exports = [authRoutes, profileRoutes, requestRouter, userRouter];
