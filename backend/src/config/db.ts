import mongoose from 'mongoose';
import dns from 'dns';

// Use Google DNS to resolve MongoDB Atlas SRV records
// (fixes routers that don't support SRV lookups)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not set in .env file');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ Database connection error: ${error.message}`);
    console.warn('⚠️  Will continue without database. Some features may not work.');
  }
};

export default connectDB;
