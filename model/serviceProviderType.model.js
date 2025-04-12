const mongoose = require("mongoose");

const serviceProviderTypeSchema = mongoose.Schema({
  name: { type: String },
  type: { type: String }, // individual / organization
});

const serviceProviderTypeModel = mongoose.model(
  "serviceProviderTypes",
  serviceProviderTypeSchema
);

module.exports = serviceProviderTypeModel;
