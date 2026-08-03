require("dotenv").config();

const logger = require("./logger");

const parseDurationToMs = (value) => {

    if (!value)
        return null;

    if (/^\d+$/.test(value))
        return Number(value);

    const match = value.match(/^(\d+)(ms|s|m|h|d)$/);

    if (!match)
        return null;

    const amount = Number(match[1]);
    const unit = match[2];

    const multipliers = {
        ms: 1,
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    return amount * multipliers[unit];

};

const accessTokenSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_TOKEN_SECRET;
const accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || process.env.JWT_ACCESS_TOKEN_EXPIRY;
const refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || process.env.JWT_REFRESH_TOKEN_EXPIRY;
const bcryptSaltRounds = process.env.bcryptSaltRounds || process.env.BCRYPT_SALT_ROUNDS;

const accessTokenExpiryMs = parseDurationToMs(accessTokenExpiry);
const refreshTokenExpiryMs = parseDurationToMs(refreshTokenExpiry);

const missingVariables = [];

if (!accessTokenSecret)
    missingVariables.push("JWT_ACCESS_SECRET or JWT_ACCESS_TOKEN_SECRET");

if (!refreshTokenSecret)
    missingVariables.push("JWT_REFRESH_SECRET or JWT_REFRESH_TOKEN_SECRET");

if (!accessTokenExpiry || accessTokenExpiryMs === null)
    missingVariables.push("JWT_ACCESS_EXPIRY or JWT_ACCESS_TOKEN_EXPIRY");

if (!refreshTokenExpiry || refreshTokenExpiryMs === null)
    missingVariables.push("JWT_REFRESH_EXPIRY or JWT_REFRESH_TOKEN_EXPIRY");

if (!bcryptSaltRounds)
    missingVariables.push("bcryptSaltRounds or BCRYPT_SALT_ROUNDS");

if (missingVariables.length > 0) {

    logger.error(`Missing or invalid authentication environment variables: ${missingVariables.join(", ")}`);

    process.exit(1);

}


module.exports = {

    port : process.env.PORT,

    database : {
        name : process.env.DB_NAME,
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
    },

    jwt: {
        accessTokenSecret,
        refreshTokenSecret,
        accessTokenExpiry,
        refreshTokenExpiry,
        accessTokenExpiryMs,
        refreshTokenExpiryMs
    },

    bcryptSaltRounds : Number(bcryptSaltRounds)

}