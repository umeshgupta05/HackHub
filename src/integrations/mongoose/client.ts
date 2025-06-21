import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || "";

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully using Mongoose!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export default connectDB;