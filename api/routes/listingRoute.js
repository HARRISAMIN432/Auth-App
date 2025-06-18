const express = require("express");
const { verify } = require("../utils/verifyUser");
const {
  createListing,
  deleteListing,
} = require("../controllers/listingController");

const router = express.Router();

router.post("/create", verify, createListing);
router.delete("/delete/:id", verify, deleteListing);

module.exports = router;
