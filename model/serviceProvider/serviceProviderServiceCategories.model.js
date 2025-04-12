const mongoose = require("mongoose");

const serviceProviderServiceCategoriesSchema = mongoose.Schema({
  name: { type: String },
  medicalServiceCategory: { type: String },
  status: { type: String },
});

const serviceProviderServiceCategoriesModel = mongoose.model(
  "serviceproviderservicecategories",
  serviceProviderServiceCategoriesSchema
);

module.exports = serviceProviderServiceCategoriesModel;
