import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express()

const server = createServer( app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    path: "/socket.io/",
    logger: console,
    credentials: true
  }
});

const nameToSocketIdMap = new Map()
const socketIdToNameMap = new Map();

const getUserSocketId = (name) => {
  return nameToSocketIdMap.get(name);
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // User Chatting
  socket.on('single-send', ({chat, receiverID}) => {
    io.to(receiverID).emit('single-receive', {chat})
  })

  // User calling
  socket.on("user:details", ({name, phno}) => {
    nameToSocketIdMap.set(name, socket.id)
    socketIdToNameMap.set(socket.id, name)

    console.log("User details received:", name, phno, socket.id);
    socket.join(phno)
    
    io.to(phno).emit("user:joined", { name, phno, socketID: socket.id })
    io.to(socket.id).emit("user:details", { name, phno, socketID: socket.id})
  })

  socket.on("call:offer", ({ to: receiverID, offer }) => {
    const name = socketIdToNameMap.get(socket.id);
    io.to(receiverID).emit("call:answer", { offer, from: socket.id, name })
  })

  socket.on("call:negotiate", ({ to: receiverID, answer }) => {
    io.to(receiverID).emit("call:final", {answer, from: socket.id})
  })

  socket.on("peer:nego:needed", ({ to: receiverID, offer }) => {
    io.to(receiverID).emit("peer:nego:offer", { offer, from: socket.id })
  })

  socket.on("peer:nego:answer", ({ to: receiverID, answer }) => {
    io.to(receiverID).emit("peer:nego:final", { answer, from: socket.id })
  })

  socket.on("call:declined", ({ to: receiverID }) => {
    const name = socketIdToNameMap.get(socket.id);
    io.to(receiverID).emit("call:declined", { from: socket.id, name });
  })

  socket.on("call:end", ({ to: receiverID }) => {
    io.to(receiverID).emit("call:end", { from: socket.id })
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
})

export { app, server, io, getUserSocketId }