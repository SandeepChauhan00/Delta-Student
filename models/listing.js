const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

// Schema definition
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
    required: true,
    default: 0,
  },

  location: {
    type: String,
  },

  country: {
    type: String,
  },

  // optional field for category (used by your filter icons)
  category: {
    type: String,
    enum: ["trending", "rooms", "city", "mountain", "castle", "pool", "camp", "farm", "dome", "boat"],
    default: "trending"
  },

  // link reviews
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  // link user
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  // for map and coordinates
  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    default: [77.1025, 28.7041] // default: Delhi, India
  }
},
});

// delete all related reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews && listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// create search index for text-based search
listingSchema.index({
  title: "text",
  description: "text",
  location: "text",
  country: "text",
  category: "text",
});

// create index for geolocation queries
listingSchema.index({ geometry: "2dsphere" });

// export model
module.exports = mongoose.model("Listing", listingSchema);
