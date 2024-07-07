const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsynch.js");
const ExpressError = require("../utils/ExpressError.js");
const flash = require("connect-flash");
const Listing = require("../models/listing.js")
const methodOverride = require("method-override");
const { isLoggedin , isOwner} = require("../middleware.js");
const listingController  = require("../controllers/listing.js");
const listing = require("../models/listing.js");
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))    //index route show all Listings :
.post(isLoggedin,upload.single('listing[image]'),wrapAsync(listingController.createListing)
);  //Create route

  //New route 
  router.get("/new",isLoggedin,listingController.renderNewForm);

  router.route("/:id")
  .put(isLoggedin,isOwner,upload.single('listing[image]') ,wrapAsync(listingController.renderEditedForm))   //put the edited form
  .delete(isLoggedin,isOwner ,wrapAsync(listingController.deleteListing))   //delete route 
  .get(wrapAsync(listingController.showListing));    //Show route 

  
  //edit route
  router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm))
  module.exports = router; 