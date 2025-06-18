const Listing = require("../models/listingModel");
const { ErrorHandler } = require("../utils/error");

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

exports.deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(ErrorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef.toString()) {
    return next(ErrorHandler(401, "You can only delete your own listings"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (e) {
    next(e);
  }
};
