const express = require("express");
const { verify } = require("../utils/verifyUser");
const {
  createListing,
  deleteListing,
  updateListings,
  getListing,
} = require("../controllers/listingController");

const router = express.Router();

router.post("/create", verify, createListing);
router.delete("/delete/:id", verify, deleteListing);
router.post("/update/:id", verify, updateListings);
router.get("/getListing/:id", getListing);

module.exports = router;
