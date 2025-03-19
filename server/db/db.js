import { connect } from 'mongoose';
import { config } from "dotenv";
config();

const databaseURL = process.env.DATABASE_URL;

const dbConnect = async () => {
    try {
        await connect(databaseURL);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

export default dbConnect;