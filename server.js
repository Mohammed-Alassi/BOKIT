//this file is used to setup the server

//environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//modules
const mongoose = require("mongoose");
const app = require("./app");

//connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

//start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
