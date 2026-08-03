const express = require("express");

const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const usersRoute = require("./routes/usersRoutes");
const healthRoute = require("./routes/healthRoute");

const globalErrorHandler = require("./middlewares/globalErrorHandler");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.use("/users", usersRoute);

app.use("/health", healthRoute);

app.use(globalErrorHandler);

module.exports = app;