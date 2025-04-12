const socket = require("socket.io");

const { WEB_URL } = require("../config/constants");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: WEB_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("-");

      socket.join(roomId);
    });
    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("-");

      io.to(roomId).emit("newMessageRecieved", { firstName, text });
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
