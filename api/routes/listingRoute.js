const express = require("express");
const verify = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", verify, createListing);
