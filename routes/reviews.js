const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsynch.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js")
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")




//Review route 
//Show review route
router.post("/:id/reviews",isLoggedin,validateReview,wrapAsync(reviewController.showReview));

//delete review route
router.delete("/:listingId/reviews/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;