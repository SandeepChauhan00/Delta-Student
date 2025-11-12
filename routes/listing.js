const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listings = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

// ✅ specific routes first
router.get("/search", wrapAsync(listings.searchListing));
router.get("/new", isLoggedIn, listings.renderNewForm);

// ✅ then routes with dynamic params
router.get("/", wrapAsync(listings.index));
router.post("/", isLoggedIn, validateListing, wrapAsync(listings.createListing));
router.get("/:id", wrapAsync(listings.showListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.editListing));
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listings.updateListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listings.deleteListing));


module.exports = router;
