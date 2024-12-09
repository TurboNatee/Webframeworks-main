const mongoose = require('mongoose');
const argon2 = require('argon2');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    }
});



const User = mongoose.model('Users', userSchema);

module.exports = User;
