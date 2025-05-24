//modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

//generateToken
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, city, age } = req.body;

    //check for existing user by email or phone
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email or phone already exists",
      });
    }

    //create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      city,
      age,
    });

    //let Mongoose validate all fields
    await newUser.validate();

    //hash the password
    newUser.password = await bcrypt.hash(password, 10);

    //save the validated and hashed user
    await newUser.save();

    //hide password before sending response
    newUser.password = undefined;

    //response
    res.status(201).json({
      status: "success",
      message: "signed up successfully",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    //handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((el) => el.message);
      return res.status(400).json({
        status: "fail",
        message: messages.join(" | "),
      });
    }

    //default server error
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again.",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate email and password
    const dummyUser = new User({ email, password });
    const validationErr = dummyUser.validateSync(["email", "password"]);

    if (validationErr) {
      const messages = Object.values(validationErr.errors).map(
        (el) => el.message
      );
      return res.status(400).json({
        status: "fail",
        message: messages.join(" | "),
      });
    }

    //find user by email + include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    //compare provided password with hashed one
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    //generate token and hide password
    const token = generateToken(user._id);
    user.password = undefined;

    //respond with success
    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again.",
    });
  }
};
