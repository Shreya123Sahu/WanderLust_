const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url : String,
    filename: String
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    // required: true,
  },
  reviews:[
    {
      type : Schema.Types.ObjectId,
      ref : "Review"

    }
  ],
  owner:{
    type : Schema.Types.ObjectId,
    ref : "User"
  }
});

module.exports = mongoose.model("Listing", listingSchema);
