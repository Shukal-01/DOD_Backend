const mongoose = require("mongoose");

const doctorReviewSchema = mongoose.Schema({
  patientId: { type: String },
  patientName: { type: String },
  patientImage: { type: String },
  patientCity: { type: String },
  doctorId: { type: String },
  RatingValue: { type: Number },
  RatingReview: { type: String },
  date: { type: String },
  helpfulCount: { type: Number, default: 0 }, // patient Id Array
});

const doctorReviewModel = mongoose.model("doctorreviews", doctorReviewSchema);

module.exports = doctorReviewModel;
