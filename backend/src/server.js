const app = require('./app');
const config = require('./configurations/config');

app.listen(config.port, (err) => {
    if(err){
        console.log(err);
        console.log("Error starting the server");
    }

    console.log(`Server running on : localhost:${config.port}`);

});