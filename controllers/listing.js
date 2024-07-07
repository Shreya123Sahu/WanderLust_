const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("failure", "Listing you requested for does not exist :(");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // let {title , description , img, price,location,country} = req.body;
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("failure", "Listing you requested for does not exist :(");
    return res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing });
};

module.exports.renderEditedForm = async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body.listing;
  const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!updatedListing) {
    throw new ExpressError("Listing not found", 404);
  }
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  req.flash("success", "Listing updated!");

  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted!");

  res.redirect(`/listings`);
};
