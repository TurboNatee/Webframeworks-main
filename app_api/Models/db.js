const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const dbURI = process.env.URI;
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongoose is connected");
    } catch (err) {
        console.error("Could not connect to the database:", err);
    }
};

// Connect to the database
connectDB();

require('./Schema');
