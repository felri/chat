var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(5000);

const list = []

io.on('connection', function (socket) {
  socket.on('create', function (room) {
    console.log(room)
    socket.join(room);
    io.to(room).emit('connected', list);
  });

  socket.on('message', function (data) {
    console.log(data);
    list.push(data.hello)
    socket.emit('message', { hello: 'from server' });
  });

  socket.on('disconnect', function () {
    io.to('some room').emit('user disconnected');
  });

});