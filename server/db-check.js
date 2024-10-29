const mongoose = require('mongoose');
const config = require('config');

async function checkDatabase() {
    try {
        const dbUrl = process.env.DB_URL || config.get('db');
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Try to execute a simple command to verify full connection
        await mongoose.connection.db.admin().ping();
        console.log('Database connection successful');
        process.exit(0);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

checkDatabase();