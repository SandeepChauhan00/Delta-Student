const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listings = require("../controllers/listings.js");
const reviewRouter = require("./review.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// ✅ Correct nested reviews mount
router.use("/:id/reviews", reviewRouter);

// ✅ All valid routes
router.get("/", wrapAsync(listings.index));
router.get("/new", isLoggedIn, listings.renderNewForm);
router.post("/", isLoggedIn, validateListing, wrapAsync(listings.createListing));
router.get("/:id", wrapAsync(listings.showListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.editlisting));
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listings.updateListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listings.deleteListing));

module.exports = router;
