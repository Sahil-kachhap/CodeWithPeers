const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');
const ACTIONS = require('./Actions');


const server = http.createServer(app); 
const io = new Server(server);

app.use(express.static('../build'));
app.use((req, res, next)=>{
   res.sendFile(path.join(__dirname, '..','build', 'index.html'));
});

const userSocketMap = {};

function getAllConnectedClients(roomId){
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
    return {
      socketId,
      username: userSocketMap[socketId],
    }
  });
}

io.on('connection', (socket) => {

  socket.on(ACTIONS.JOIN, ({roomId, username}) => {
     userSocketMap[socket.id] = username;
     socket.join(roomId);
     const clients = getAllConnectedClients(roomId);
     clients.forEach(({socketId}) => {
       io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id
       });
     });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
      socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code});
  });
  
  socket.on(ACTIONS.SYNC_CODE, ({code, socketId}) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
  });


  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms]; //gets all rooms
    // notifies to all users in every activated room where current user is present that he has left.
    rooms.forEach((roomId) => {
       socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
         socketId: socket.id,
         username: userSocketMap[socket.id],
       });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})