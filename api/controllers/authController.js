const User = require("../models/user.model");
const bycryptjs = require("bcryptjs");
const ErrorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bycryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      message: "user created successfully",
    });
  } catch (e) {
    next(e);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const isValid = await User.findOne({ email: email });
    if (!isValid) return next(ErrorHandler(404, "User not found"));
    const hashed = bycryptjs.hashSync(password, 10);
    if (hashed != isValid.password)
      return next(ErrorHandler(401, "Wrong Credentials"));
    const token = jwt.sign({ id: isValid._id }, process.env.JWT_SECRET);
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      isValid,
    });
  } catch (e) {
    next(e);
  }
};
