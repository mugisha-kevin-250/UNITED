const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn('MONGO_URI not configured - running in demo mode without database');
            return;
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Don't exit in production - allow app to run in demo mode
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        console.warn('Running in demo mode without database');
    }
};

module.exports = connectDB;
