const handleDelete = require("../../helper/crudHelpers/Delete");
const handleGet = require("../../helper/crudHelpers/Get");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const handleUpdate = require("../../helper/crudHelpers/Update");
const { sendError } = require("../../helper/other/Req_Res_Search_function");
const organizationJobPostModel = require("../../model/organizations/organizationJobPosts.model");
const serviceProviderModel = require("../../model/serviceProvider.model");
// ======================================= crud -----------------------------------

const add = async (req, res) => {
  const organizationId = req.user.userData._id;
  const organizationData = await serviceProviderModel.findById(organizationId);
  if (!organizationData) {
    return sendError(res, 404, error.message);
  }

  let skipArr = [];
  let extraObj = {};

  if (req.body.jobWorkingDay) {
    const jobWorkingDay = req.body.jobWorkingDay;

    skipArr.push('jobWorkingDay');
    extraObj['jobWorkingDay'] = JSON.parse(jobWorkingDay);
  }

  try {
    handleCreate(
      req,
      res,
      organizationJobPostModel,
      skipArr,
      {
        ...extraObj,
        ...{
          organizationId: organizationData._id,
          organizationName: organizationData.name,
        },
      },
      ""
    );
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const get = async (req, res) => {
  try {
    handleGet(req, res, organizationJobPostModel, {});
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const deleteData = async (req, res) => {
  try {
    handleDelete(req, res, organizationJobPostModel, {
      _id: req.params.itemId,
    });
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const updateDate = async (req, res) => {
  try {
    let skipArr = [];
    let extraObj = {};

    if (req.body.jobWorkingDay) {
      const jobWorkingDay = req.body.jobWorkingDay;

      skipArr.push('jobWorkingDay');
      extraObj['jobWorkingDay'] = JSON.parse(jobWorkingDay);
      // console.log(JSON.parse(jobWorkingDay));
      
    }

    handleUpdate(req, res, organizationJobPostModel, skipArr, extraObj, "", {
      _id: req.params.itemId,
    });
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

// ======================================= crud -----------------------------------

const doctorRegistrationRequestController = {
  add,
  get,
  deleteData,
  updateDate,
};

module.exports = doctorRegistrationRequestController;
