const authService = require("../services/authService");

const cookieOptions = require("../utils/cookieOptions");

const logger = require("../configurations/logger");

const asyncHandler = require("../utils/asyncHandler");

const AppError = require("../utils/AppError");

const registerUser = asyncHandler(async (req, res) => {

    await authService.registerUser(req.body);

    logger.info(`User Registered : ${req.body.email}`);

    return res.status(201).json({
        success: true,
        message: "User registered successfully"
    });

});

const loginUser = asyncHandler(async (req, res) => {

    if (req.cookies.accessToken)
        return res.status(200).json({
            success  : "false",
            message : "User already logged in"
        })

    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);
     console.log("Generated Access Token:");
                console.log(result.accessToken);    
    

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    logger.info(`User Logged In : ${email}`);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: result.accessToken,
        user: result.user
    });

});

const refreshToken = asyncHandler(async (req, res) => {

    const token = req.cookies.refreshToken;

    if (!token)
        throw new AppError("Refresh token not found", 401);

    const result = await authService.refreshUserToken(token);

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    logger.info("Token Refreshed");

    return res.status(200).json({
        success: true,
        accessToken: result.accessToken
    });

});

const logoutUser = asyncHandler(async (req, res) => {

    const token = req.cookies.refreshToken;

    if (!req.cookies.refreshToken) {
        return res.status(401).json({
            success: false,
            message: "You need to login first"
        })
    }

    if (token)
        await authService.logoutUser(token);

    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);

    logger.info("User Logged Out");

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });

});

module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser
};