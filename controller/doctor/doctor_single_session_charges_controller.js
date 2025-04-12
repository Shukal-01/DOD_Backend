const handleDelete = require("../../helper/crudHelpers/Delete");
const handleGet = require("../../helper/crudHelpers/Get");
const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const handleCreateNew = require("../../helper/crudHelpers/new/handleCreateNew");
const handleUpdateNew2 = require("../../helper/crudHelpers/new/UpdateNew2");
const handleUpdate = require("../../helper/crudHelpers/Update");
const { sendError } = require("../../helper/other/Req_Res_Search_function");
const doctorSingleSessionChargesModel = require("../../model/doctor/doctorSingleSessionCharges");
const { sendSuccess } = require("../_utils/req_res_messages");

// ======================================= crud -----------------------------------

const add = async (req, res) => {
  try {
    const doctorId = req.user.userData._id;
    const isAdded = await handleCreateNew(
      req,
      doctorSingleSessionChargesModel,
      [],
      { doctorId: doctorId },
      ""
    );
    if (isAdded.message === "success") {
      return sendSuccess(res, 200, isAdded.data, "");
    }
    return sendError(res, 200, "Something went wrong!");
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const get = async (req, res) => {
  try {
    const doctorId = req.user.userData._id;
    handleGetWithMsg(req, res, doctorSingleSessionChargesModel, {
      doctorId: doctorId,
    });

  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const deleteData = async (req, res) => {
  try {
    handleDelete(req, res, doctorSingleSessionChargesModel, {
      _id: req.params.itemId,
    });
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const updateDate = async (req, res) => {
  try {
    const isUpdated = await handleUpdateNew2(
      req,
      doctorSingleSessionChargesModel,
      [],
      {},
      "",
      {
        _id: req.params.itemId,
      }
    );

    if (isUpdated.message === "success") {
      return sendSuccess(res, 200, isUpdated.data, "");
    }
    return sendError(res, 200, "Something went wrong!");
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

// ======================================= crud -----------------------------------

const doctorSingleSessionChargesController = {
  add,
  get,
  deleteData,
  updateDate,
};

module.exports = doctorSingleSessionChargesController;
