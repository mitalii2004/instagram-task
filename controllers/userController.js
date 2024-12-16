const User = require('../models/userModel')
const FriendRequest = require('../models/friendRequestModel')
const BlockingStatus = require('../models/blockingModel')

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { Model, default: mongoose } = require("mongoose")
const secretKey = "secretKey";

module.exports = {

    signUp: async (req, res) => {
        try {
            let objToSave = new User({
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                fullName: req.body.fullName,
                userName: req.body.userName,
                mobileNumber: req.body.mobileNumber,
            })
            let userExist = await User.findOne({ email: req.body.email })
            if (!userExist) {
                let response = await User.create(objToSave)
                return res.status(200).json({ msg: "User register successfully", response })
            } else {
                return res.status(400).json({ msg: "User already exist with same email" })
            }
        }
        catch (error) {
            throw error
        }
    },

    login: async (req, res) => {
        try {
            const { email, password, mobileNumber, userName } = req.body;

            if (!password || (!email && !mobileNumber && !userName)) {
                return res.status(400).json({ message: 'Email, mobile number, or username, along with a password, are required.' });
            }

            const query = email
                ? { email } : mobileNumber
                    ? { mobileNumber } : { userName };

            const user = await User.findOne(query);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                secretKey,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login successful.',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    userName: user.userName,
                    mobileNumber: user.mobileNumber
                }
            });
        } catch (error) {
            throw error
        }
    },

    upload: async (req, res) => {
        try {
            const { email, password, posts, reels } = req.body;

            let user = await User.findOne({ email });

            if (!user) {
                const objToSave = {
                    userId: req.body.userId,
                    email,
                    password,
                    posts: req.file ? req.file.path : null,
                    reels: req.file ? req.file.path : null,

                };

                user = await User.create(objToSave);
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                secretKey,
                { expiresIn: '1h' }
            );

            const response = {
                message: "Post or reel uploaded successfully",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    password: user.password,
                    posts: user.posts,
                    reels: user.reels,

                },
            };
            return res.status(200).json(response);
        } catch (error) {
            throw error
        }
    },

    friendRequest: async (req, res) => {
        try {
            const { sender, receiver, status } = req.body;

            if (!sender || !receiver) {
                return res.status(400).json({ error: "Sender and receiver are required." });
            }

            const senderId = new mongoose.Types.ObjectId(sender);
            const receiverId = new mongoose.Types.ObjectId(receiver);
            const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
            if (existingRequest) {
                return res.status(400).json({ error: "Friend request already exists." });
            }

            const newRequest = new FriendRequest({ sender: senderId, receiver: receiverId, status });
            await newRequest.save();

            return res.status(201).json({ message: "Friend request sent successfully.", data: newRequest });
        } catch (error) {
            console.error(error);
            throw error
        }
    },
    getFriendRequests: async (req, res) => {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ error: "User ID is required." });
            }

            const userObjectId = new mongoose.Types.ObjectId(userId);

            const requests = await FriendRequest.find({
                $or: [{ sender: userObjectId }, { receiver: userObjectId }]
            });

            return res.status(200).json({ message: "Friend requests retrieved successfully.", data: requests });
        } catch (error) {
            throw error
        }
    },
    blockingStatus: async (req, res) => {
        try {
            const { block, unblock, status } = req.body;
            if (!block || !unblock) {
                return res.status(400).json({ error: "block and unblock are required." });
            }

            const blockerId = new mongoose.Types.ObjectId(block);
            const unblockerId = new mongoose.Types.ObjectId(unblock);
            const existingBlock = await BlockingStatus.findOne({ block: blockerId, unblock: unblockerId });
            if (existingBlock) {
                return res.status(400).json({ error: "Already blocked." });
            }

            const newBlockStatus = new BlockingStatus({ block: blockerId, unblock: unblockerId, status });
            await newBlockStatus.save();

            return res.status(201).json({ message: "Blocked successfully.", data: newBlockStatus });
        } catch (error) {
            throw error
        }
    },
    getBlockingStatus:async(req,res)=>{
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ error: "User ID is required." });
            }

            const userObjectId = new mongoose.Types.ObjectId(userId);

            const blocked = await BlockingStatus.find({
                $or: [{ block: userObjectId }, { unblock: userObjectId }]
            });

            return res.status(200).json({ message: "Blocking Status retreived successfully.", data: blocked });
        
        } catch (error) {
         throw error   
        }
    }
}
