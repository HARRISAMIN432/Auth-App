const Listing = require("../models/listingModel");

exports.createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    console.log("Listing created:", listing);
    return res.status(201).json(listing);
  } catch (e) {
    console.error("Create listing error:", e);
    next(e);
  }
};
