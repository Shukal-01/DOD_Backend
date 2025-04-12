const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
const handleCreateNew = require("../../helper/crudHelpers/new/handleCreateNew");
const organizationJobPossApplicationsModel = require("../../model/organizations/organizationJobPossApplications");
const organizationJobPostModel = require("../../model/organizations/organizationJobPosts.model");
const serviceProviderModel = require("../../model/serviceProvider.model");
const { sendError, sendSuccess } = require("../_utils/req_res_messages");

const getAllOrganizationJobs = async (req, res) => {
  try {
    handleGetWithMsg(req, res, organizationJobPostModel, {
      $or: [
        {
          status: "1",
        },
      ],
    });
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const doctorGetDataController = {
  getAllOrganizationJobs,
};

module.exports = doctorGetDataController;
