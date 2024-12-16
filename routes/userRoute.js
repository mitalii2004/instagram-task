const express = require('express')
const router = express.Router()

const UserController = require("../controllers/userController")
const upload = require('../helpers/upload')
const verifyToken = require('../middleware/verifyToken').verifyToken;

router.post("/signUp", UserController.signUp)
router.post("/login", UserController.login)
router.post("/upload", upload, UserController.upload)
router.post("/friendRequest", UserController.friendRequest)
router.get("/getFriendRequests",UserController.getFriendRequests)
router.post("/blockingStatus",UserController.blockingStatus)
router.get("/getBlockingStatus",UserController.getBlockingStatus)

module.exports = router
