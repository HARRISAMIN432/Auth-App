const { ErrorHandler } = require("./error");
const jwt = require("jsonwebtoken");

exports.verify = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(ErrorHandler(401, "unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(ErrorHandler(403, "Forbidden"));
    req.user = user;
    next();
  });
};
