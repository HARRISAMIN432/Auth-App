const Listing = require("../models/listingModel");
const { ErrorHandler } = require("../utils/error");

exports.createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
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

exports.updateListings = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(ErrorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef.toString()) {
    return next(ErrorHandler(401, "You can only update your own listings"));
  }
  try {
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateListing);
  } catch (e) {
    next(e);
  }
};

exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return next(ErrorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (e) {
    next(e);
  }
};

exports.getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Parse booleans safely
    const parseBoolean = (value) =>
      value === "true" ? true : value === "false" ? false : undefined;

    let offer = parseBoolean(req.query.offer);
    let furnished = parseBoolean(req.query.furnished);
    let parking = parseBoolean(req.query.parking);
    let type = req.query.type;

    // Build the filter object
    const filters = {
      name: { $regex: req.query.searchTerm || "", $options: "i" },
    };

    if (typeof offer === "boolean") filters.offer = offer;
    if (typeof furnished === "boolean") filters.furnished = furnished;
    if (typeof parking === "boolean") filters.parking = parking;
    if (type && type !== "all") filters.type = type;
    else filters.type = { $in: ["sale", "rent"] };

    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const listings = await Listing.find(filters)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    console.log(listings);
    return res.status(200).json(listings);
  } catch (e) {
    next(e);
  }
};
