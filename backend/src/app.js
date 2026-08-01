const express = require('express');

const db = require("./configurations/database")

const healthRoute = require('./routes/healthRoute');


const cookie_parser = require('cookie-parser');


const app = express();

app.use(cookie_parser());
app.use(express.json());


app.use("/health", healthRoute);



module.exports = app;