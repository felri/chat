var express = require('express');
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
import 'dotenv/config';

import models, { connectDb } from './models';

const eraseDatabaseOnSync = true;

const createUsersWithMessages = async () => {
  const room1 = new models.Room({
    room: 'rwieruch',
  });
  const message1 = new models.Messages({
    text: 'Published the Road to learn React',
    room: room1.id,
  });
  await message1.save();
  await room1.save();
};


connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.Room.deleteMany({}),
      models.Messages.deleteMany({}),
    ]);
  }
  server.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`)
    createUsersWithMessages()
  });

  io.on('connection', function (socket) {
    socket.on('create', room => {
      socket.join(room);

      models.Room.findOneOrCreate({ room: room }, (err, room) => {
        models.Messages.find({ room: room._id }, (err, messages) => {
          console.log(messages)
          io.to(room).emit('connected', messages);
        })
      })


    });

    socket.on('message', function (data) {

      socket.emit('message', { hello: 'from server' });
    });

    socket.on('disconnect', function () {
      io.to('some room').emit('user disconnected');
    });

  });
});

