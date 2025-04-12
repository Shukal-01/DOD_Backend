const handleDelete = require("../../helper/crudHelpers/Delete");
const handleGet = require("../../helper/crudHelpers/Get");
const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const handleUpdate = require("../../helper/crudHelpers/Update");
const { sendError } = require("../../helper/other/Req_Res_Search_function");
const organizationJoinedDoctorsModel = require("../../model/organizations/organizationJoinedDoctors.model");

// ======================================= crud -----------------------------------

// const add = async (req, res) => {
//     try {
//         handleCreate(req, res,organizationJoinedDoctorsModel, [], {}, "")
//     } catch (error) {
//         return sendError(res, 404, error.message)
//     }
// }

const handleGetOrganizationsWorkingDoctors = async (req, res) => {
  try {
    const serviceProviderId = req.user.userData._id;
    handleGetWithMsg(
      req,
      res,
      organizationJoinedDoctorsModel,
      {
        organizationId: serviceProviderId,
      },
      true
    );
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

// const deleteData = async (req, res) => {
//     try {
//         handleDelete(req, res, organizationJoinedDoctorsModel, { _id: req.params.itemId })
//     } catch (error) {
//         return sendError(res, 404, error.message)
//     }
// }

const updateDateData = async (req, res) => {
  // console.log('comming --');
  
  try {
    const skipArray = [];
    const extraObj = {};

    if (req.body.workingDays) {
      const workingDays = req.body.workingDays;

      skipArray.push("workingDays");
      extraObj["workingDays"] = JSON.parse(workingDays);
    }

    handleUpdate(
      req,
      res,
      organizationJoinedDoctorsModel,
      skipArray,
      extraObj,
      "",
      {
        _id: req.params.itemId,
      }
    );
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

// ======================================= crud -----------------------------------

const organizationsEmployeesDoctorController = {
  handleGetOrganizationsWorkingDoctors,
  updateDateData,
};

module.exports = organizationsEmployeesDoctorController;

// const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
// const organizationJoinedDoctorsModel = require("../../model/organizations/organizationJoinedDoctors.model");
// const { sendError } = require("../_utils/req_res_messages");
