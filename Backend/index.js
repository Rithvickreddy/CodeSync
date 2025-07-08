import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const roomUsers = {};

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    
    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    roomUsers[roomId].push(socket.id);
    
    io.to(roomId).emit("user-list", roomUsers[roomId]);
  });
  socket.on("call-user", ({ roomId, signalData }) => {
    socket.to(roomId).emit("user-joined", signalData);
  });

  socket.on("accept-call", ({ roomId, signalData }) => {
    socket.to(roomId).emit("call-accepted", signalData);
  });

  socket.on("code-change", (data) => {
    if (!data || !data.roomId || data.code === undefined) return;
    
    socket.to(data.roomId).emit("code-change", {
      roomId: data.roomId,
      code: data.code
    });
  });

  socket.on("output-change", (data) => {
    if (!data || !data.roomId) return;
    
    socket.to(data.roomId).emit("output-change", {
      roomId: data.roomId,
      result: data.result
    });
  });

  socket.on("disconnect", () => {
    for (const roomId in roomUsers) {
      const userIndex = roomUsers[roomId].indexOf(socket.id);
      if (userIndex !== -1) {
        roomUsers[roomId].splice(userIndex, 1);
        
        if (roomUsers[roomId].length === 0) {
          delete roomUsers[roomId];
        } else {
          io.to(roomId).emit("user-list", roomUsers[roomId]);
        }
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});