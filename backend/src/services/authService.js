const bcrypt = require("bcrypt");

const config = require("../configurations/config");

const userModel = require("../models/userModel");

const refreshTokenModel = require("../models/refreshTokenModel");

const jwt = require("../utils/jwt");

const AppError = require("../utils/AppError");

const logger = require("../configurations/logger");


//        ----------register user--------------

const registerUser = async (user) => {

    const [day, month, year] = user.date_of_birth.split("/");
    user.date_of_birth = `${year}-${month}-${day}`;

    const hashedPassword = await bcrypt.hash(
        user.password,
        Number(config.bcryptSaltRounds)
    );

    user.password_hash = hashedPassword;

    delete user.password;

    return new Promise((resolve, reject) => {

        userModel.register(user, (err) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {

                    if (err.sqlMessage.includes("username"))
                        return reject(new AppError("Username already exists", 409));

                    if (err.sqlMessage.includes("email"))
                        return reject(new AppError("Email already registered", 409));

                    if (err.sqlMessage.includes("mobile_number"))
                        return reject(new AppError("Mobile number already registered", 409));

                }

                return reject(err);

            }

            resolve();

        });

    });

};


//        ----------login user--------------


const loginUser = async (email, password) => {

    return new Promise((resolve, reject) => {

        userModel.findByEmail(email, async (err, rows) => {

            if (err)
                return reject(err);

            if (rows.length === 0) {
                logger.error(`Failed Login : ${email}`);

                return reject(new AppError("Invalid email or password", 401));
            }

            const user = rows[0];

            const passwordMatched = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!passwordMatched) {
                logger.error(`Failed Login : ${email}`);

                return reject(new AppError("Invalid email or password", 401));
            }

            const accessToken = jwt.generateAccessToken(user);

            const refreshToken = jwt.generateRefreshToken(user);

            const expiresAt = new Date(
                Date.now() + config.jwt.refreshTokenExpiryMs
            );

            refreshTokenModel.deleteUserRefreshTokens(
                user.id,
                (deleteErr) => {

                    if (deleteErr)
                        return reject(deleteErr);

                    refreshTokenModel.saveRefreshToken(
                        user.id,
                        refreshToken,
                        expiresAt,
                        (err) => {

                            if (err)
                                return reject(err);

                            resolve({
                                accessToken,
                                refreshToken,
                                user: {
                                    id: user.id,
                                    username: user.username,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    email: user.email
                                }
                            });

                        }
                    );

                }
            );

        });

    });

};

//        ----------refresh user token--------------

const refreshUserToken = async (refreshToken) => {

    return new Promise((resolve, reject) => {

        const failRefresh = (message) => {
            logger.error(`Failed Refresh : ${message}`);

            reject(new AppError(message, 401));
        };

        const deleteExpiredToken = (message) => {
            refreshTokenModel.deleteRefreshToken(
                refreshToken,
                (deleteErr) => {

                    if (deleteErr)
                        return reject(deleteErr);

                    failRefresh(message);

                }
            );
        };

        let decoded;

        try {

            decoded = jwt.verifyRefreshToken(refreshToken);

        }
        catch (error) {

            if (error.name === "TokenExpiredError")
                return deleteExpiredToken("Refresh token expired");

            return failRefresh("Invalid refresh token");

        }

        refreshTokenModel.findRefreshToken(
            refreshToken,
            (err, rows) => {

                if (err)
                    return reject(err);

                if (rows.length === 0)
                    return failRefresh("Invalid refresh token");

                const storedRefreshToken = rows[0];

                if (Number(storedRefreshToken.user_id) !== Number(decoded.id))
                    return failRefresh("Invalid refresh token");

                if (new Date(storedRefreshToken.expires_at).getTime() <= Date.now())
                    return deleteExpiredToken("Refresh token expired");

                userModel.findById(decoded.id, (userErr, users) => {

                    if (userErr)
                        return reject(userErr);

                    if (users.length === 0)
                        return reject(new AppError("User not found", 404));

                    refreshTokenModel.deleteRefreshToken(
                        refreshToken,
                        (deleteErr) => {

                            if (deleteErr)
                                return reject(deleteErr);

                            const accessToken = jwt.generateAccessToken(users[0]);
                            const newRefreshToken = jwt.generateRefreshToken(users[0]);
                            const expiresAt = new Date(
                                Date.now() + config.jwt.refreshTokenExpiryMs
                            );

                            refreshTokenModel.saveRefreshToken(
                                users[0].id,
                                newRefreshToken,
                                expiresAt,
                                (saveErr) => {

                                    if (saveErr)
                                        return reject(saveErr);

                                    resolve({
                                        accessToken,
                                        refreshToken: newRefreshToken
                                    });

                                }
                            );

                        }
                    );

                });

            }
        );


    });

};

const logoutUser = async (refreshToken) => {

    return new Promise((resolve, reject) => {

        refreshTokenModel.deleteRefreshToken(
            refreshToken,
            (err) => {

                if (err)
                    return reject(err);

                resolve();

            }
        );

    });

};

module.exports = {
    registerUser,
    loginUser,
    refreshUserToken,
    logoutUser
};