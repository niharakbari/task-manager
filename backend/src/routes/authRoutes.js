const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {
    registerValidation,
    loginValidation
} = require("../validations/authValidation");

const validationMiddleware = require("../middlewares/validationMiddleware");

router.post(
    "/register",
    registerValidation,
    validationMiddleware,
    authController.registerUser
);

router.post(
    "/login",
    loginValidation,
    validationMiddleware,
    authController.loginUser
);

router.post(
    "/refresh-token",
    authController.refreshToken
);

router.post(
    "/logout",
    authController.logoutUser
);

module.exports = router;