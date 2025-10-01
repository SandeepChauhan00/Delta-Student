const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage } = require("../cloudConfig.js");
const upload = multer({ storage }); 

router
  .route("/")
  .get(wrapAsync(listingController.indexlisting))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    // validateListing,
    wrapAsync(listingController.createlisting)
  );


// New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
  .route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    // validateListing,
    wrapAsync(listingController.updatelisting)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deletelisting));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editlisting)
);

module.exports = router;
