const { Server } = require("socket.io");

const userDict = {};

function connectIO(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://batarilo.me"],
      methods: ["POST", "GET"],
    },
  });
  setIOEvents(io);
}

function setIOEvents(io) {
  io.on("connection", (socket) => {
    //conncection variables
    let usernameCon;
    let roomCon;

    //when user joins room
    socket.on("join_room", async ({ room, username }) => {
      usernameCon = username;
      roomCon = room;

      try {
        await socket.join(room);

        const newUser = { id: socket.id, username };

        if (!userDict[room]) userDict[room] = [];

        //add user to list
        userDict[room] = [...userDict[room], newUser];

        //emit user list to all users
        await io.in(room).emit("users", userDict[room]);
      } catch (error) {
        socket.emit("join_error", "Failed to join.");
      }
    });

    socket.on("send_message", (messageData) => {
      console.log(messageData);
      socket.to(messageData.room).emit("receive_message", messageData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnecting..");

      if (!roomCon || !usernameCon || !userDict[room]) return;
      // remove the user from the user list of that room
      userDict[roomCon] = userDict[roomCon].filter(
        (user) => user.id !== socket.id
      );

      // emit updated user list to all users in that room
      io.in(roomCon).emit("users", userDict[roomCon]);
      //emmit message of leaving chat
      io.in(roomCon).emit(
        "receive_message",
        generateMessage(`User ${usernameCon} left the room`)
      );
    });
  });
}

function generateMessage(message) {
  //generate message
  const messageData = {
    author: "system",
    message,
    time:
      new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
  };
  return messageData;
}

module.exports = { connectIO };
