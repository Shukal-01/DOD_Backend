const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  image: { type: String },
  bannerImage: { type: String },
  name: { type: String },
  shortDescription: { type: String },
  description: { type: String },
  eventReason: { type: String },
  date: { type: String },
  time: { type: String },
  address: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  googleMapUrl: { type: String },
  status: { type: String }, // active / inactive
});

const eventModel = mongoose.model("events", eventSchema);

module.exports = eventModel;
