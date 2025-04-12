const mongoose = require("mongoose");

const doctorProfileGalleriesSchema = mongoose.Schema({
  image: { type: String },
  doctorId: { type: String },
  status: { type: String },
  date: { type: String },
});

const doctorProfileGalleriesModel = mongoose.model(
  "doctorProfileGalleries",
  doctorProfileGalleriesSchema
);

module.exports = doctorProfileGalleriesModel;
