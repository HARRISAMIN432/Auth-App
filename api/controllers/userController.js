const User = require("../models/user.model");
const { ErrorHandler } = require("../utils/error");
const bcryptjs = require("bcryptjs");

exports.updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(ErrorHandler(401, "You can only update your own account"));
  try {
    const allowedFields = ["username", "email", "password", "profilePicture"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    if (updates.password)
      updates.password = bcryptjs.hashSync(updates.password, 10);
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email))
      return next(ErrorHandler(400, "Invalid email format"));
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return next(ErrorHandler(404, "User not found"));
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({
      success: true,
      data: rest,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(ErrorHandler(400, "Email already exists"));
    }
    next(error);
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
