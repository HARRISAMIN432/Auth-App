const express = require("express");
const verify = require("../utils/verifyUser");
const createListing = require("../controllers/listingController");

const router = express.Router();

router.post("/create", verify, createListing);
