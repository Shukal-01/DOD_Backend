const handleDelete = require("../../helper/crudHelpers/Delete");
const handleGet = require("../../helper/crudHelpers/Get");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const {
  getDateTimeInStringFormat,
} = require("../../helper/date&TimeFunctions/date_Time_functions");

const doctorProfileGalleriesModel = require("../../model/doctor/doctorProfileGalleryModel");

const addGalleryImage = async (req, res) => {
  try {
    const doctorId = req.user.userData._id;
    const date = getDateTimeInStringFormat();
    handleCreate(
      req,
      res,
      doctorProfileGalleriesModel,
      [],
      { doctorId: doctorId, status: "active", date: date },
      ""
    );
  } catch (error) {
    return res.status(200).json({ message: "error" });
  }
};

const getGalleryImages = async (req, res) => {
  const doctorId = req.user.userData._id;

  handleGet(req, res, doctorProfileGalleriesModel, {
    doctorId: doctorId,
  });
};

const deleteGalleryImage = async (req, res) => {
  handleDelete(req, res, doctorProfileGalleriesModel, {
    _id: req.params.itemId,
  });
};

module.exports = { addGalleryImage, getGalleryImages, deleteGalleryImage };
