const handleDelete = require("../../helper/crudHelpers/Delete");
const handleGet = require("../../helper/crudHelpers/Get");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const handleUpdate = require("../../helper/crudHelpers/Update");
const {
  getDateTimeInStringFormat,
} = require("../../helper/date&TimeFunctions/date_Time_functions");
const serviceProviderProfileGalleriesModel = require("../../model/serviceProvider/serviceProviderProfileGalleries.model");

const addGalleryImage = async (req, res) => {
  try {
    const serviceProviderId = req.user.userData._id;
    const date = getDateTimeInStringFormat();
    handleCreate(
      req,
      res,
      serviceProviderProfileGalleriesModel,
      [],
      { serviceProviderId: serviceProviderId, status: "active", date: date },
      ""
    );
  } catch (error) {
    return res.status(200).json({ message: "error" });
  }
};

const getGalleryImages = async (req, res) => {
  const serviceProviderId = req.user.userData._id;

  handleGet(req, res, serviceProviderProfileGalleriesModel, {
    serviceProviderId: serviceProviderId,
  });
};

const deleteGalleryImage = async (req, res) => {
  handleDelete(req, res, serviceProviderProfileGalleriesModel, {
    _id: req.params.itemId,
  });
};

module.exports = { addGalleryImage, getGalleryImages, deleteGalleryImage };
