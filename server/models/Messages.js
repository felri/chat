import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
});
const Message = mongoose.model('Message', schema);
export default Message;