import { Server } from "socket.io";
import http from "http";
import express from "express";

//creating express app
const app = express();

//creating http server because app run top of the http
const server = http.createServer(app);

//now makr socket.io server on top of the http Server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}



io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  //BroadCasting updated user like who is online after every new user connection
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // socket.emit("newMessage",{text:"Hello World"})

  
  //This event will run when user close the tab or Internet loss

 socket.on("typing", ({ recieverId, isTyping }) => {
  
  if (userSocketMap[recieverId]) {
    io.to(userSocketMap[recieverId]).emit("typingStatus", {
      userId,
      isTyping,
    });
  }
});

  

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };