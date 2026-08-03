const asyncHandler = require("../utils/asyncHandler");

const logger = require("../configurations/logger");

const userService = require("../services/userService");

const cookieOptions = require("../utils/cookieOptions");

const getUsers = asyncHandler(async (req, res) => {

    const users = await userService.getUsers();

    return res.status(200).json({
        success: true,
        users
    });

});

const getMe = asyncHandler(async (req, res) => {

    return res.status(200).json({
        success: true,
        user: req.user
    });

});

const deleteMe = asyncHandler(async (req, res) => {

    await userService.deleteUserAccount(req.user.id);

    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);

    logger.info(`Delete Account : ${req.user.email}`);

    return res.status(200).json({
        success: true,
        message: "Account deleted successfully"
    });

});

module.exports = {
    getUsers,
    getMe,
    deleteMe
};