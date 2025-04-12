const handleDelete = require("../../helper/crudHelpers/Delete");
const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
const handleUpdate = require("../../helper/crudHelpers/Update");
const doctorModel = require("../../model/doctors.model");
const organizationJobPossApplicationsModel = require("../../model/organizations/organizationJobPossApplications");
const { sendError, sendSuccess } = require("../_utils/req_res_messages");

const getThisJobPostsAllApplication = async (req, res) => {
  const { jobpostid } = req.params;
  if (!jobpostid) {
    return sendError(
      res,
      200,
      "Invalid Request! Please refresh and try again."
    );
  }
  handleGetWithMsg(
    req,
    res,
    organizationJobPossApplicationsModel,
    { JopPostId: jobpostid },
    true
  );
};

const getThisJobPostThisApplicationsDoctorData = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return sendError(
        res,
        200,
        "Invalid Request! Please refresh and try again."
      );
    }

    const doctorData = await doctorModel.findById(doctorId);
    if (!doctorData) {
      return sendError(
        res,
        200,
        "Something went wrong! Please refresh and try again."
      );
    }

    return sendSuccess(res, 200, doctorData, "");
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const deleteData = async (req, res) => {
  try {
    handleDelete(req, res, organizationJobPossApplicationsModel, {
      _id: req.params.itemId,
    });
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const updateData = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    let extraObj = {};
    if (status === "accepted") {
      extraObj = {
        doctorAcceptedOffer: "pending",
        applicationUpdateDateByOrganization: Date.now(),
      };
    }

    handleUpdate(
      req,
      res,
      organizationJobPossApplicationsModel,
      [],
      extraObj,
      "",
      {
        _id: itemId,
      }
    );
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

const organizationJobPostApplicationsController = {
  getThisJobPostsAllApplication,
  deleteData,
  getThisJobPostThisApplicationsDoctorData,
  updateData,
};

module.exports = organizationJobPostApplicationsController;
