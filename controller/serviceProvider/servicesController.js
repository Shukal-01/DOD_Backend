const handleGet = require("../../helper/crudHelpers/Get");
const serviceProviderModel = require("../../model/serviceProvider.model");
const serviceProviderServiceCategoriesModel = require("../../model/serviceProvider/serviceProviderServiceCategories.model");
const serviceProviderServicesModel = require("../../model/serviceProvider/serviceProviderServices.model");

const handleGetAllServiceCategories = async (req, res) => {
  const returnError = () => {
    return res.status(200).json({ message: "error", data: [] });
  };
  try {
    const serviceProviderId = req.user.userData._id;
    const proFileData = await serviceProviderModel.findOne({
      _id: serviceProviderId,
    });

    if (!proFileData.category) {
      return returnError();
    }
    const categoryId = proFileData.category;
    handleGet(req, res, serviceProviderServiceCategoriesModel, {
      medicalServiceCategory: categoryId,
    });
  } catch (error) {
    return returnError();
  }
};
const handleGetAllServices = async (req, res) => {
  const returnError = () => {
    return res.status(200).json({ message: "error", data: [] });
  };
  try {
    const serviceProviderId = req.user.userData._id;
    const proFileData = await serviceProviderModel.findOne({
      _id: serviceProviderId,
    });

    if (!proFileData.category) {
      return returnError();
    }
    const categoryId = proFileData.category;

    const allCategories = await serviceProviderServiceCategoriesModel.find({
      medicalServiceCategory: categoryId,
    });

    const newSearchArray = allCategories.map((v) => {
      return {
        serviceProviderServiceCategory: v._id,
      };
    });

    let allServices = await serviceProviderServicesModel.find({
      $or: newSearchArray,
    });

    return res.status(200).json(allServices);
  } catch (error) {
    return returnError();
  }
};

module.exports = { handleGetAllServiceCategories, handleGetAllServices };
