const mongoose = require("mongoose");

const serviceProviderReviewSchema = mongoose.Schema({
  patientId: { type: String },
  patientName: { type: String },
  patientImage: { type: String },
  patientCity: { type: String },
  serviceProviderId: { type: String },
  RatingValue: { type: Number },
  RatingReview: { type: String },
  date: { type: String },
  helpfulCount: { type: Array }, // patient Id Array
});

const serviceProviderReviewModel = mongoose.model(
  "serviceproviderreviews",
  serviceProviderReviewSchema
);

module.exports = serviceProviderReviewModel;
