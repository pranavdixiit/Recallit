// server/config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  // ✅ Debug: Log this BEFORE calling mongoose.connect
  console.log("MONGO_URI ->", process.env.MONGO_URI);

  // ✅ Ensure your MONGO_URI is loaded from the .env file
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected');
};
