import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
  }
  room: {
    type: String,
    unique: true,
  },
  firebaseToken: {
    type: String,
  }
});

schema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
  const self = this
  self.findOne(condition, (err, result) => {
    return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
  })
}

schema.pre('remove', function (next) {
  this.model('Messages').deleteMany({ room: this._id }, next);
});

const Room = mongoose.model('Room', schema);
export default Room;