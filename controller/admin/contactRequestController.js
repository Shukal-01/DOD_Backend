const contactRequestModel = require("../../model/contactRequest.model");
// ----------------------------------------------------------------
// crud handlers
const handleDelete = require("../../helper/crudHelpers/Delete");
const handleUpdate = require("../../helper/crudHelpers/Update");
// ----------------------------------------------------------------

const get = async (req, res) => {
  let data = await contactRequestModel.find({ status: "pending" });
  return res.status(200).json({ message: "success", data: data });
};

const deleteData = async (req, res) => {
  handleDelete(req, res, contactRequestModel, { _id: req.params.itemId });
};
const updateDate = async (req, res) => {
  handleUpdate(req, res, contactRequestModel, [], {}, "", {
    _id: req.params.itemId,
  });
};

module.exports = { get, deleteData, updateDate };
