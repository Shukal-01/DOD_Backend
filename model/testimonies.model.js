const mongoose = require("mongoose");

const testimonySchema = mongoose.Schema({
  reviewText: { type: String },
  ratingValue: { type: Number },
  customerId: { type: String },
  date: { type: String },
  status: { type: String },
});

const testimonyModel = mongoose.model("testimonies", testimonySchema);

module.exports = testimonyModel;
