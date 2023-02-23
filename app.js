const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected with ID", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User with ID", socket.id, "joined room with ID", data);
  });

  socket.on("send_message", (messageData) => {
    console.log(messageData);
    socket.to(messageData.room).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected.");
  });
});

server.listen(3001, () => {
  console.log("Chat server running on port 3001..");
});
