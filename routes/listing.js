const express = require("express");
const router = express.Router();
// const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// index route
router.get("/new", isLoggedIn, listingController.newListing);

// create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    // isOwner,
    validateListing,
    wrapAsync(listingController.createListing)
  )

// deleted route
// show route
// update route
router
  .route("/:id")
  .delete(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.delete)
  )
  .get(
    // validateListing,
    wrapAsync(listingController.show)
  )
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    // validateListing,
    wrapAsync(listingController.update)
  );

// New route

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  // isOwner,
  wrapAsync(listingController.edit)
);
module.exports = router;
