const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// const flash = require("connect-flash");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  // console.log(allListing);
  res.render("listings/index.ejs", { allListing });
  // .then((res)=>{console.log(res); })//here it will get all result
};

module.exports.newListing = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you requested does not exist");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  req.flash("success", "New Listing edited successfully");
  res.render("listings/edit.ejs", { listing, originalUrl });
};
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // res.send("done!!");
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  // let {title,description,image,price,country,location}=req.body;//we can get  all values either these way without doing anything  // but another way is to pass key pairs as we have done
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);

  const newListing = new Listing(req.body.listing);
  // console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry=response.body.features[0].geometry;
  // console.log(newListing);
  // if(!newListing.title){
  //   throw new ExpressError(  400,"Title is missing!");
  // }
  // if(!newListing.description){
  //   throw new ExpressError(400,"description is missing!");
  // }
  // let result = listingSchema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }
  let savedListing=await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing added");
  res.redirect("/listings");
};
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  // console.log(listing); // const rev=await Review.findById(id  );// console.log(rev);
  if (!listing) {
    req.flash("error", "listing you requested does not exist");
    res.redirect("/listings");
  }
  console.log("hello");
  console.log(listing.owner);
  res.render("listings/show.ejs", { listing });
};

module.exports.update = async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};
