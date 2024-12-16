const mongoose = require('mongoose');
// const Schema = mongoose.Schema

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId

    },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected']
    }
},
    {
        timestamps: true
    });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
module.exports = FriendRequest
