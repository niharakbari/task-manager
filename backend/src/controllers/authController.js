const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");
const logger = require("../configurations/logger");
const AppError = require("../utils/AppError");

const registerUser = async (req, res, next) => {

    try {

        const user = req.body;

        const hashedPassword = await bcrypt.hash(user.password, 10);

        user.password_hash = hashedPassword;

        delete user.password;

        userModel.register(user, (err, result) => {

            if (err) {

                logger.warn(`User Registration Failed : ${err.message}`);

                return next(
                    new AppError("User already registered", 409)
                );

            }

            logger.info(`User Registered : ${user.email}`);

            res.status(201).json({
                success: true,
                message: "User registered successfully"
            });

        });

    }
    catch (err) {

        next(err);

    }

};

module.exports = {
    registerUser
};