'use strict';

// User model goes here
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    passHash: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = new mongoose.model("users", schema);