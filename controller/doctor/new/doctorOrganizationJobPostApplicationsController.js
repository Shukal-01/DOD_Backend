const handleGetWithMsg = require("../../../helper/crudHelpers/GetWithMsg");
const handleCreateNew = require("../../../helper/crudHelpers/new/handleCreateNew");
const doctorModel = require("../../../model/doctors.model");
const organizationJobPossApplicationsModel = require("../../../model/organizations/organizationJobPossApplications");
const organizationJobPostModel = require("../../../model/organizations/organizationJobPosts.model");
const organizationJoinedDoctorsModel = require("../../../model/organizations/organizationJoinedDoctors.model");
const serviceProviderModel = require("../../../model/serviceProvider.model");
const { sendError, sendSuccess } = require("../../_utils/req_res_messages");

const organizationJobApplyByDoctor = async (req, res) => {
  try {
    const { jobPostId, organizationId } = req.body;
    const doctorData = req.user.userData;

    const isAlreadyApplied = await organizationJobPossApplicationsModel.findOne(
      { jobPostId, doctorId: doctorData._id }
    );

    if (isAlreadyApplied) {
      return sendError(res, 200, "Application Exists!");
    }

    // fetch organizationData
    const organizationData = await serviceProviderModel.findById(
      organizationId
    );
    if (!organizationData) {
      return sendError(res, 200, "Cannot apply to this organization!");
    }

    const isCreated = await handleCreateNew(
      req,
      organizationJobPossApplicationsModel,
      [],
      {
        applicantName: doctorData.name,
        organizationName: organizationData.name,
        doctorId: doctorData._id,
        applicationTime: Date.now(),
        status: "pending",
      }
    );

    if (isCreated.message == "success") {
      return sendSuccess(
        res,
        200,
        { doctorJobApplicationId: isCreated._id },
        ""
      );
    }

    return sendError(res, 200, isCreated.detail);
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const handleGetMyAppliedJobApplications = async (req, res) => {
  try {
    const doctorData = req.user.userData;

    handleGetWithMsg(req, res, organizationJobPossApplicationsModel, {
      doctorId: doctorData._id,
    });
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const handleAcceptOrganizationOffer = async (req, res) => {
  // step 1: mark 'organizationjobpossapplications ' -> doctorAcceptedOffer -> accepted
  // stop 2: create new organizationjoineddoctors
  try {
    const { applicationId } = req.params;

    const isUpdatedOrganizationJobPossApplication =
      await organizationJobPossApplicationsModel.findOneAndUpdate(
        { _id: applicationId },
        {
          doctorAcceptedOffer: "accepted",
          joiningDate: Date.now(),
        }
      );

    if (!isUpdatedOrganizationJobPossApplication) {
      return sendError(res, 200, "Something went wrong! Please try again.");
    }

    const { JopPostId, organizationId, doctorId } =
      isUpdatedOrganizationJobPossApplication;

    if (
      [JopPostId, organizationId, doctorId].some(
        (val) => val === null || val === undefined
      )
    ) {
      return sendError(res, 200, "Something Went Wrong! Please try again.");
    }

    const _doctorData = await doctorModel.findById(doctorId);
    const organizationData = await serviceProviderModel.findById(
      organizationId
    );
    const jobPostData = await organizationJobPostModel.findById(JopPostId);

    const isCreatedNewOrganizationJoinedDoctors =
      await organizationJoinedDoctorsModel.create({
        doctorId: doctorId,
        organizationId: organizationId,
        jobPostId: JopPostId,
        doctorName: _doctorData.name,
        organizationName: organizationData.name,
        organizationLogo: organizationData.image,
        jobDesignation: jobPostData.title,
        salaryOfDoctor: 0,
        chatRate: 0,
        videoCallRate: 0,
        callRate: 0,
        jobStartTime: jobPostData.jobStartTime,
        jobEndTime: jobPostData.jobEndTime,
        workingDays: jobPostData.jobWorkingDay,
        offerAcceptDate: Date.now(),
        workingStatus: "inactive",
      });

    if (isCreatedNewOrganizationJoinedDoctors) {
      return sendSuccess(res, 200, "", "");
    }

    return sendError(res, 200, "Something Went Wrong! Please try again later.");
  } catch (error) {
    // console.log(error.message);

    return sendError(res, 200, error.message);
  }
};

const handleRejectOrganizationOffer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const isUpdatedOrganizationJobPossApplication =
      await organizationJobPossApplicationsModel.findOneAndUpdate(
        { _id: applicationId },
        {
          doctorAcceptedOffer: "rejected",
          rejectedDate: Date.now(),
        }
      );

    if (isUpdatedOrganizationJobPossApplication) {
      return sendSuccess(res, 200, "", "");
    }
    return sendError(res, 200, "Something Went Wrong! Please try again later.");
  } catch (error) {
    // console.log(error.message);

    return sendError(res, 200, error.message);
  }
};

const handleGetOrganizationWhereDoctorIsJoinedAndWorking = async (req, res) => {
  const doctorId = req.user.userData._id;

  handleGetWithMsg(req, res, organizationJoinedDoctorsModel, {
    doctorId: doctorId,
    $or: [
      { workingStatus: "working" },
      { workingStatus: "inactive" },
      { workingStatus: "blocked" },
    ],
  });
};

const doctorOrganizationJobPostApplicationsController = {
  organizationJobApplyByDoctor,
  handleGetMyAppliedJobApplications,
  handleAcceptOrganizationOffer,
  handleRejectOrganizationOffer,
  handleGetOrganizationWhereDoctorIsJoinedAndWorking,
};

module.exports = doctorOrganizationJobPostApplicationsController;
