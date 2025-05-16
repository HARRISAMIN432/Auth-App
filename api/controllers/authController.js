const User = require("../models/user.model");
const bycryptjs = require("bcryptjs");

module.exports = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bycryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      message: "user created successfully",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
};
