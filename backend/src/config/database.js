import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using the connection string from environment variables
 * Handles connection errors and successful connection logging
 */
const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ MongoDB Connection Error: MONGODB_URI is not set in .env file');
      console.error('💡 Please create a .env file in the backend folder with your MongoDB connection string');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Please check your MONGODB_URI in the .env file');
    console.error('💡 Make sure you replaced <password> and <dbname> with actual values');
    process.exit(1);
  }
};

export default connectDB;

