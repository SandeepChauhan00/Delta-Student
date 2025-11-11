const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const listings = require("../controllers/listings.js");

// INDEX
router
  .route("/")
  .get(wrapAsync(listings.indexlisting))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listings.createlisting)
  );

// SEARCH
router.get("/search", wrapAsync(listings.searchListing));
router.get("/search", wrapAsync(listings.searchListing));

// NEW FORM
router.get("/new", isLoggedIn, listings.renderNewForm);

// SHOW / EDIT / UPDATE / DELETE
router
  .route("/:id")
  .get(wrapAsync(listings.showlisting))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listings.updatelisting)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listings.deletelisting));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.editlisting));


const Listing = require("../models/listing.js");

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


module.exports = router;
