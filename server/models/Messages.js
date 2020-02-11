import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: String,
    required: true
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
}, { timestamps: true });

const Messages = mongoose.model('Messages', schema);
export default Messages;