//this file is used to initialize the express app

//modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const pitchRouter = require("./routes/pitchRouter");
const reservationRouter = require("./routes/reservationRouter");
const userRouter = require("./routes/userRouter");
const leaderboardRouter = require("./routes/leaderboardRouter");
require("./utils/leaderboardCron"); //to run the cron job

//initializing the express app
const app = express();

//allow requests from your frontend origin
app.use(
  cors({
    origin: "http://localhost:8080", // React app URL
  })
);

//middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(morgan("dev")); //logging

//routes
app.use("/auth", authRouter);
app.use("/pitches", pitchRouter);
app.use("/reservations", reservationRouter);
app.use("/users", userRouter);
app.use("/leaderboards", leaderboardRouter);

//exporting the app
module.exports = app;
