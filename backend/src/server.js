const app = require('./app');
const config = require('./configurations/config');

const logger = require('./configurations/logger');

app.listen(config.port, (err) => {
    if(err){
        console.log(err);
        console.log("Error starting the server");
    }

    logger.info("Server connected successfully");

});