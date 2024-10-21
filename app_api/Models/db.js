const mongoose = require('mongoose');

const dbURI = "mongodb+srv://Nathan:Kwagga123@rodsandrotors.hjklg.mongodb.net/RodsandRotors?retryWrites=true&w=majority";

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
