const asyncHandler = require("../utils/asyncHandler");

const logger = require("../configurations/logger");

const userService = require("../services/userService");
const cookieOptions = require("../utils/cookieOptions");
const dateUtils = require("../utils/dateUtils");

const formatUserForResponse = (user) => ({

    ...user,
    date_of_birth: dateUtils.formatDateForResponse(user.date_of_birth),
    created_at: dateUtils.formatDateForResponse(user.created_at),
    updated_at: dateUtils.formatDateForResponse(user.updated_at)

});

const formatUsersForResponse = (users) => users.map(formatUserForResponse);

const getUsers = asyncHandler(async (req, res) => {

    const users = await userService.getUsers();

    return res.status(200).json({
        success: true,
        users: formatUsersForResponse(users)
    });

});

const getMe = asyncHandler(async (req, res) => {

    return res.status(200).json({
        success: true,
        user: formatUserForResponse(req.user)
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