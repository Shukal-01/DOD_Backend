const handleUpdate = require("../../helper/crudHelpers/Update");
const serviceProviderModel = require("../../model/serviceProvider.model");

const updateServiceProviderProfile = (req, res) => {
  const serviceProviderId = req.user.userData._id;

  const stopArray = [];
  const updateObj = {};

  if (req.body.category) {
    stopArray.push("category");
    updateObj.category = JSON.parse(req.body.category);
  }
  if (req.body.activeCategories) {
    stopArray.push("activeCategories");
    updateObj.activeCategories = JSON.parse(req.body.activeCategories);
  }
  if (req.body.activeServices) {
    stopArray.push("activeServices");
    updateObj.activeServices = JSON.parse(req.body.activeServices);
  }
  handleUpdate(req, res, serviceProviderModel, stopArray, updateObj, "", {
    _id: serviceProviderId,
  });
};

const getprofiledata = async (req, res) => {
  const serviceProviderId = req.user.userData._id;
  const proFileData = await serviceProviderModel.findOne({
    _id: serviceProviderId,
  });
  return res.status(200).json({ message: "success", data: proFileData });
};

const newregistrationrequest = async (req, res) => {
  const serviceProviderId = req.user.userData._id;
  // console.log('comming');
  
  handleUpdate(
    req,
    res,
    serviceProviderModel,
    ["category"],
    { category: JSON.parse(req.body.category), status: "pending", isOnline: 0 },
    "",
    { _id: serviceProviderId }
  );
};

module.exports = {
  updateServiceProviderProfile,
  getprofiledata,
  newregistrationrequest,
};
