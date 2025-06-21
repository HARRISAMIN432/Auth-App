import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

function ListingItem({ listing }) {
  const price = listing.offer ? listing.discountPrice : listing.regularPrice;

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls?.[0] ||
            "https://via.placeholder.com/330x220.png?text=No+Image"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name || "No title"}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address || "No address provided"}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {listing.description || "No description available"}
          </p>
          <p className="text-lg font-semibold text-slate-700 mt-2">
            ${typeof price === "number" ? price.toLocaleString("en-US") : "N/A"}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingItem;
