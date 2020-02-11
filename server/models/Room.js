import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  room: {
    type: String,
    unique: true,
  },
  firebaseToken: {
    type: String,
  }
}, { timestamps: true });

schema.statics.findOneOrCreate = function findOneOrCreate(condition, data, callback) {
  const self = this
  self.findOne(condition, (err, result) => {
    if (result) {
      return callback(err, result)
    } else {
      const room = {
        room: data.room,
        name: data.name
      }
      return self.create(room, (err, result) => { return callback(err, result) })
    }

  })
}

schema.pre('remove', function (next) {
  this.model('Messages').deleteMany({ room: this._id }, next);
});

const Room = mongoose.model('Room', schema);
export default Room;