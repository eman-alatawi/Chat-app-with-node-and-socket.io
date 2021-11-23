const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const Message = require("./Message");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/chatbox", (error) => {
  if (!error) {
    console.log("Connected Yippee..!!");
  } else {
    console.log("Error connecting to database.");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Get all messages from the database.
  Message.find()
    .sort({ createdAt: -1 })
    .exec((err, messages) => {
      if (err) return console.error(err);
      console.log("messages from db: " + messages);
      // Send messages to the user.
      socket.emit("init", messages);
    });

  // Listen to connected users for a new message.
  socket.on("message", (msg) => {
    // Create a message.
    const message = new Message({
      content: msg.content,
      from: msg.from,
      to: msg.to,
      createdAt: msg.time,
    });

    // Save the message to the database.
    message.save((err) => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
    socket.broadcast.emit("push", msg);
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
