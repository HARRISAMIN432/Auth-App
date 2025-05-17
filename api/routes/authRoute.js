const express = require("express");
const { signup, signin } = require("../controllers/authController.js");
const router = express.router();

router.post("/signup", signup);
router.post("/signin", signin);

module.exports = router;
