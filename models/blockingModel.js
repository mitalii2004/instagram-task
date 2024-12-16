const mongoose = require('mongoose');
// const Schema = mongoose.Schema

const blockingSchema = new mongoose.Schema({
    block: {
        type: mongoose.Schema.Types.ObjectId
    },

    unblock: {
        type: mongoose.Schema.Types.ObjectId

    },

    status: {
        type: String,
        enum: ['block', 'unblock']
    }
},
    {
        timestamps: true
    });

const BlockingStatus = mongoose.model('BlockingStatus', blockingSchema);
module.exports = BlockingStatus
