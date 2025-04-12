const handleCreate = require("../../helper/crudHelpers/handleCreate");
const testimonyModel = require("../../model/testimonies.model");

const addNewReveiw = async (req, res) => {
  handleCreate(req, res, testimonyModel, [], {
    status: "new",
  });
};

const getAllReview = async (req, res) => {
  const allReviews = await testimonyModel
    .find({ $or: [{ status: "new" }, { status: "active" }] })
    .limit(10);
  return res.status(200).json({ message: "success", data: allReviews });
};

module.exports = { addNewReveiw, getAllReview };
