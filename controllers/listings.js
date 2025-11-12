const Listing = require("../models/listing.js");

// Show all listings
module.exports.index = async (req, res) => {
  const listings = await Listing.find();
  res.render("listings/index", { listings, query: "" });
};

// Show single listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
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
module.exports.createListing = async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to create a listing.");
    return res.redirect("/login");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect(`/listings/${newListing._id}`);
};

// Delete listing
module.exports.deleteListing = async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to delete a listing.");
    return res.redirect("/login");
  }

  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

// Edit listing
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const originalImageUrl = listing.image?.url || listing.image || "/images/default.jpg";
  res.render("listings/edit", { listing, originalImageUrl });
};

// Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// Search listings
module.exports.searchListing = async (req, res) => {
  const query = req.query.q || "";
  const listings =
    query.trim() !== ""
      ? await Listing.find({ title: { $regex: query, $options: "i" } })
      : await Listing.find();

  res.render("listings/index", { listings, query });
};
