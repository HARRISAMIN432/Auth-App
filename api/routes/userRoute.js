const express = require("express");
const { test, updateUser } = require("../controllers/userController");
const { verify } = require("../utils/verifyUser");

const router = express.Router();

router.route("/test").get(test);
router.post("/update/:id", verify, updateUser);

module.exports = router;
