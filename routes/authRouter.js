//modules
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

//routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

//export
module.exports = router;
