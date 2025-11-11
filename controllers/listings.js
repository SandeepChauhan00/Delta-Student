const Listing = require("../models/listing.js");

// Show all listings
module.exports.indexlisting = async (req, res) => {
  const listings = await Listing.find();
  res.render("listings/index", { listings, query: "" });
};

// Show single listing
module.exports.showlisting = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" }
    });

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// Render new form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// Create listing
module.exports.createlisting = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // ✅ assign current user
  await newListing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect(`/listings/${newListing._id}`);
};

// Edit listing
module.exports.editlisting = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // ensure image url exists (for Cloudinary or local image)
  const originalImageUrl = listing.image?.url || listing.image || "/images/default.jpg";

  res.render("listings/edit", { listing, originalImageUrl });
};


// Update listing
module.exports.updatelisting = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// Delete listing
module.exports.deletelisting = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

// Search listings
module.exports.searchListing = async (req, res) => {
  const query = req.query.q || "";
  let listings = [];

  if (query.trim() !== "") {
    listings = await Listing.find({
      title: { $regex: query, $options: "i" },
    });
  } else {
    listings = await Listing.find();
  }

  res.render("listings/index", { listings, query });
};
