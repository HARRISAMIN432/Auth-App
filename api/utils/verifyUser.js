const { ErrorHandler } = require("./error");
const jwt = require("jsonwebtoken");

exports.verify = (req, res, next) => {
  const token = req.cookie.access_token;
  if (!token) return next(new ErrorHandler(401, "unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new ErrorHandler(403, "Forbidden"));
    req.user = user;
    next();
  });
};
