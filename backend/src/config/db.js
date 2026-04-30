import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  const conn = await mongoose.connect(config.mongodbUri);
  return conn;
};
