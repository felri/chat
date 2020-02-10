import mongoose from 'mongoose';
import Room from './Room';
import Messages from './Messages';

const connectDb = () => {
  return mongoose.connect(process.env.MONGO_URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
};

const models = { Room, Messages };

export { connectDb };
export default models;