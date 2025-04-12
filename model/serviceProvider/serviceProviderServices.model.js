const mongoose = require("mongoose");

const serviceProviderServicesSchema = mongoose.Schema({
  name: { type: String },
  icon: { type: String },
  description: { type: String },
  serviceProviderServiceCategory: { type: String },
  status: { type: String },
});

const serviceProviderServicesModel = mongoose.model(
  "serviceproviderservices",
  serviceProviderServicesSchema
);

module.exports = serviceProviderServicesModel;
