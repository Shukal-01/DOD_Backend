// socket/globalSocketServer.js
require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");

function startGlobalSocketServer() {
  const server = http.createServer();

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // Ensure WebSocket is allowed
  });

  const sockets = new Map();

  io.on("connection", (socket) => {
    const clientData = socket.handshake.auth;

    if (!clientData || !clientData._id) return socket.disconnect();

    sockets.set(clientData._id, { clientData, socket });

    socket.on("message", (msg) => {
      const { user, messageData } = msg;

      if (!user || user.length === 0) {
        sockets.forEach(({ socket }) => {
          try {
            socket.emit("server_message", messageData);
          } catch (error) {
            // handle error if needed
          }
        });
      } else {
        user.forEach((userId) => {
          const target = sockets.get(userId);
          if (target) target.socket.emit("server_message", messageData);
        });
      }
    });

    socket.on("disconnect", () => {
      sockets.delete(clientData._id);
    });
  });

  server.listen(process.env.GLOBALSOCKEIOTPORT, "0.0.0.0", () => {
    console.log(`Global Socket Server running on port ${process.env.GLOBALSOCKEIOTPORT}`);
  });
}

module.exports = startGlobalSocketServer;
