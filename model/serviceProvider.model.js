const mongoose = require("mongoose");

const serviceProviderSchema = mongoose.Schema({
  name: { type: String },
  image: { type: String }, //0
  bannerImage: { type: String },
  // ----------------------------------------------------------------
  email: { type: String },
  mobileNumber: { type: Number },
  // ----------------------------------------------------------------
  country: { type: String },
  state: { type: String },
  city: { type: String },
  pincode: { type: String },
  completeAddress: { type: String },
  // ----------------------------------------------------------------
  // organizationOrIndivisual: { type: String },
  workAddress: { type: String },
  workStartTiming: { type: String },
  workEndTiming: { type: String },
  // ----------------------------------------------------------------
  isOnline: { type: Number }, //0
  // ----------------------------------------------------------------
  category: { type: String },
  // ----------------------------------------------------------------
  // ----------------------------------------------------------------
  // To Be Added
  websiteUrl: { type: String },
  yearOfEstablishment: { type: String },

  //   -----
  instagramUrl: { type: String },
  facebookUrl: { type: String },
  watsappNumber: { type: Number },
  linkedInUrl: { type: String },
  // ----------------------------------------------------------------
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  // ----------------------------------------------------------------
  // services of service provider
  activeCategories: { type: Array },
  activeServices: { type: Array },
  // ----------------------------------------------------------------
  aboutUs: { type: String },
  // ----------------------------------------------------------------
  createdOn: { type: Date }, //0
  status: { type: String }, //verified | pending  | rejected | blocked
  // ----------------------------------------------------------------
  // ---------------------------------------
  currentBalance: { type: Number, default: 0 },
  // ---------------------------------------
  isVerified: { type: String },
  targetText: { type: String },
  yearsOfExperience: { type: String },
  // ----------------------------------------------------------------
  deviceId: { type: String },
  // ----------------------------------------------------------------
});

const serviceProviderModel = mongoose.model(
  "serviceProvider",
  serviceProviderSchema
);

module.exports = serviceProviderModel;
