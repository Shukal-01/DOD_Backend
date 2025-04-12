const mongoose = require("mongoose");

const medicalServicesSchema = mongoose.Schema({
  name: { type: String },
  icon: { type: String },
  description: { type: String },
  serviceProvidertype: { type: String }, // individual / organization
  doctorSystem: { type: String }, // 1 , 0
  bookingSystem: { type: String }, // 1 , 0
  status: { type: String },
});

const medicalServicesModel = mongoose.model(
  "medicalServices",
  medicalServicesSchema
);

module.exports = medicalServicesModel;
