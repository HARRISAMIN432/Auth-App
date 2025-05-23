const User = require("../models/user.model");
const { ErrorHandler } = require("../utils/error");
const bcryptjs = require("bcryptjs");

exports.test = (req, res) => {
  res.json({
    message: "User route is working",
    status: "success",
  });
};

exports.updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(ErrorHandler(401, "User ID did not match"));
  try {
    if (req.body.password) bcryptjs.hashSync(req.body.password, 10);
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(ErrorHandler(401, "User ID did not match"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({
      message: "User has been deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};
