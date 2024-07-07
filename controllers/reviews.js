const Review = require("../models/review.js");
const Listing = require("../models/listing.js")


module.exports.showReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      listing.reviews.push(newReview);
  
      await newReview.save();
      await  listing.save();
      req.flash("success","New review added!")
      // res.send("new review send");
      res.redirect(`/listings/${listing._id}`)   
  }

  module.exports.deleteReview =  async (req, res) => {
    const { listingId, reviewId } = req.params;
    // Ensure that the listing exists
    const listing = await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!")
  
    // Redirect back to the listing's page
    res.redirect(`/listings/${listingId}`);
  }