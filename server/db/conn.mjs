import mongoose from 'mongoose';

const ATLAS_URI = process.env.ATLAS_URI || "";

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ATLAS_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectDB;