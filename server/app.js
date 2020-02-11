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
    user: 'phone'
  });
  const message2 = new models.Messages({
    text: 'Published the Road to learn React',
    room: room1.id,
    user: 'phone'
  });
  const message3 = new models.Messages({
    text: 'Published the Road to learn React',
    room: room1.id,
    user: 'phone'
  });
  const message4 = new models.Messages({
    text: 'Published the Road to learn React',
    room: room1.id,
    user: 'phone'
  });
  const message5 = new models.Messages({
    text: 'Published the Road to learn React',
    room: room1.id,
    user: 'phone'
  });
  const message6 = new models.Messages({
    text: 'Published the Road to learn React',
    room: room1.id,
    user: 'phone'
  });
  const message7 = new models.Messages({
    text: 'Published the Road to learn React',
    room: room1.id,
    user: 'phone'
  });
  const message8 = new models.Messages({
    text: 'Published the Road to learn React',
    room: room1.id,
    user: 'phone'
  });
  await message1.save();
  await message2.save();
  await message3.save();
  await message4.save();
  await message5.save();
  await message6.save();
  await message7.save();
  await message8.save();
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

    socket.on('create', function (data) {
      socket.join(data.room);
      models.Room.findOneOrCreate({ room: data.room }, data, (err, room) => {
        models.Messages.paginate({ room: room._id }, data.options, (err, messages) => {
          io.to(data.room).emit('connected', { messages: messages.docs, room: room });
        })
      })
    })

    socket.on('message', function (data) {
      models.Room.findOne({ room: data.room }, async (err, room) => {
        const message = await new models.Messages({
          text: data.message,
          room: room._id,
          user: data.user
        })

        await message.save()

        models.Messages.find({ room: room._id }, (err, messages) => {
          io.in(data.room).emit('message', message);
        })
      })
    })

    socket.on('clean', function (data) {
      models.Room.findOneOrCreate({ room: data.room }, (err, room) => {
        modes.Room.remove({ id: room._id }, (err, resp) => {
          io.to(data.room).emit('romm cleaned');
        })
      })
    });

    socket.on('disconnect', function (data) {
      io.to(data.room).emit('user disconnected');
    })
  })
})

