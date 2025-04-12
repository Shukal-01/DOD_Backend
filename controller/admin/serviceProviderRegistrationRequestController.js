const serviceProviderModel = require("../../model/serviceProvider.model");

// ----------------------------------------------------------------
// crud handlers
const handleDelete = require("../../helper/crudHelpers/Delete");
const handleUpdate = require("../../helper/crudHelpers/Update");
// ----------------------------------------------------------------

const get = async (req, res) => {
  let data = await serviceProviderModel.find();
  return res.status(200).json({ message: "success", data: data });
};

const deleteData = async (req, res) => {
  handleDelete(req, res, serviceProviderModel, { _id: req.params.itemId });
};

const updateDate = async (req, res) => {
  // handleUpdate(req, res, doctorRegistrationModel, [], {}, "", {
  //     _id: req.params.itemId,
  // });

  // const givenStatus = req.body.status;
  handleUpdate(req, res, serviceProviderModel, [], {}, "", {
    _id: req.params.itemId,
  });
};

module.exports = { get, deleteData, updateDate };
