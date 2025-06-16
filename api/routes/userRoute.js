const express = require("express");
const {
  updateUser,
  deleteUser,
  getListings,
} = require("../controllers/userController");
const { verify } = require("../utils/verifyUser");
const { uploadImage, upload } = require("../utils/upload");

const router = express.Router();

router.post("/update/:id", verify, updateUser);
router.delete("/delete/:id", verify, deleteUser);
router.post("/upload", upload.single("image"), uploadImage);
router.get("/listings/:id", verify, getListings);

module.exports = router;
