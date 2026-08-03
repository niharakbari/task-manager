const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const { verifyToken } = require("../middlewares/authMiddleware");

router.get(
    "/",
    verifyToken,
    userController.getUsers
);

router.get(
    "/me",
    verifyToken,
    userController.getMe
);

router.delete(
    "/me",
    verifyToken,
    userController.deleteMe
);

module.exports = router;