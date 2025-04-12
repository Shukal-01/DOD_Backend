const mongoose = require("mongoose");

const serviceProviderProfileGalleriesSchema = mongoose.Schema({
  image: { type: String },
  serviceProviderId: { type: String },
  status: { type: String },
  date: { type: String },
});

const serviceProviderProfileGalleriesModel = mongoose.model(
  "serviceproviderprofilegalleries",
  serviceProviderProfileGalleriesSchema
);

module.exports = serviceProviderProfileGalleriesModel;
