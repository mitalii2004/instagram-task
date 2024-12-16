const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    userName: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    posts: {
        type: String
    },
    reels: {
        type: String
    },
    deviceToken: {
        type: String
    },
    deviceType: {
        type: String
    }
},
    {
        timestamps: true
    })

const users = mongoose.model('users', userSchema)
module.exports = users
