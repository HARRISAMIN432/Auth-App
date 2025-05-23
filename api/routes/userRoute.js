const express = require("express");
const {
  test,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verify } = require("../utils/verifyUser");

const router = express.Router();

router.route("/test").get(test);
router.post("/update/:id", verify, updateUser);
router.delete("/delete/:id", verify, deleteUser);

module.exports = router;
