const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

router.get(
    "/",
    protect,
    userController.getUsers
);

router.get(
    "/me",
    protect,
    userController.getMe
);

router.delete(
    "/me",
    protect,
    userController.deleteMe
);

module.exports = router;