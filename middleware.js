const Review = require("./models/review.js")
const { reviewSchema } = require("./schema.js");

const Listing = require("./models/listing");

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = "/listings"; // Default redirect URL
    }
    next();
};


module.exports.isOwner = async (req,res,next)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("failure","You are not the owner!");
      return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const { listingId,reviewId } = req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
      req.flash("failure","You are not the owner!");
      return res.redirect(`/listings/${listingId}`);
    }

    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        next(new ExpressError(404, errMsg)); 
    } else {
        next();
    }
  }