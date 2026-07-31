const config = require('./config');

const mysql2 = require('mysql2');

const db = mysql2.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
});

db.connect((err) => {
    if(err) {
        logger.error(err);
        logger.error("Database connection failed!");
    }

    logger.info("Database connected successfuly")

})