const express = require("express");
const {
  test,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verify } = require("../utils/verifyUser");
const { uploadImage, upload } = require("../utils/upload");

const router = express.Router();

router.post("/update/:id", verify, updateUser);
router.delete("/delete/:id", verify, deleteUser);
router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
