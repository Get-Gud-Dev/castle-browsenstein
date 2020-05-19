var app = require('express')

var http = require('http').createServer(app);
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    


    socket.on('disconnect', () => {
        console.log('user disconnected');
      });    
  });

http.listen(3000, () => {
    console.log('listening on *:3000');
  });