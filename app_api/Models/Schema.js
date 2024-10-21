const mongoose = require('mongoose');

// Define your car part schema
const carPartSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
        default: 0 // Adding oldPrice to match your sample data
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: [0, 'Stock quantity cannot be negative']
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Define your Users schema
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
}, { timestamps: true });

// Register both models
mongoose.model('products', carPartSchema);
mongoose.model('users', userSchema);
