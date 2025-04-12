const doctorProfileController = require("../../controller/doctor/profile");
const doctorWorkController = require("../../controller/doctor/workController");
const doctorPodcastController = require("../../controller/doctor/podCastController");
const doctorGalleryController = require("../../controller/doctor/doctorGalleryController");
const doctorSessionController = require("../../controller/doctor/new/doctorSessionController");
const doctorGetDataController = require("../../controller/doctor/getDataControllers");
const doctorOrganizationJobPostApplicationsController = require("../../controller/doctor/new/doctorOrganizationJobPostApplicationsController");
const doctorSingleSessionChargesController = require("../../controller/doctor/doctor_single_session_charges_controller");

const router = require("express").Router();

// --------------------- profils  ----------------
router.put("/updateprofile", doctorProfileController.updateDoctorProfile);
router.put("/update-image", doctorProfileController.updateDoctorProfile);
router.get("/getprofiledata", doctorProfileController.getprofiledata);
// --------------------- profils  ----------------

// =================================== new code --

// ------- session related apis
router.get(
  "/api/session/get-pending_accepted-requests",
  doctorSessionController.handleGetAllPendingAndAcceptedSessionRequests
);
router.put(
  "/api/session/reject-pending-requests/:sessionId",
  doctorSessionController.handleRejectPendingSessionRequest
);
router.put(
  "/api/session/cancel-accepted-requests/:sessionId",
  doctorSessionController.handleCancelAcceptedSessionRequest
);
router.put(
  "/api/session/accept-pending-requests/:sessionId",
  doctorSessionController.handleAcceptPendingSessionRequest
);
router.put(
  "/api/session/start-requests-session/:sessionId",
  doctorSessionController.handleStartSessionRequest
);
router.get(
  "/api/session/get-ongoing-session/:sessionId",
  doctorSessionController.handleGetOngoingSessionData
);
router.get(
  "/api/session/check_for-ongoing-session",
  doctorSessionController.handleCheckForOngoingSession
);
router.post(
  "/api/session/end_meeting_from_doctor_side/:sessionId",
  doctorSessionController.handleMarkComepleteSession
);
router.put(
  "/api/session/add-message-session/:sessionId",
  doctorSessionController.handleAddMessageToSession
);
router.get(
  "/api/session/get-message-session/:sessionId",
  doctorSessionController.handleGetMessagesOfSession
);

// -- session prescription
router.post(
  "/api/session/add-prescription/:sessionId",
  doctorSessionController.handleAddPrescription
);
// -- session prescription
// -- session history
router.get(
  "/api/session/get-session-history",
  doctorSessionController.handleGetSessionHistory
);
// -- session history

// ------- session related apis

// ------- organization jobs related apis
router.get(
  "/api/organization/jobs/getAll",
  doctorGetDataController.getAllOrganizationJobs
);
router.post(
  "/api/organization/jobs/apply",
  doctorOrganizationJobPostApplicationsController.organizationJobApplyByDoctor
);
router.get(
  "/api/organization/jobs-application/getAll",
  doctorOrganizationJobPostApplicationsController.handleGetMyAppliedJobApplications
);
router.post(
  "/api/organization/jobs-application/accept/:applicationId",
  doctorOrganizationJobPostApplicationsController.handleAcceptOrganizationOffer
);
router.post(
  "/api/organization/jobs-application/reject/:applicationId",
  doctorOrganizationJobPostApplicationsController.handleRejectOrganizationOffer
);
router.get(
  "/api/organization/get-organization-doctor-joined-and-working",
  doctorOrganizationJobPostApplicationsController.handleGetOrganizationWhereDoctorIsJoinedAndWorking
);

// ------- organization jobs related apis

// --------------------- work status ----------------
// router.get("/getdoctorworkstatus", doctorProfileController.getprofiledata);
router.post("/comeonline", doctorWorkController.comeonline);
router.post("/gooffline", doctorWorkController.gooffline);

// --------------------- work status ----------------

// --------------------- single session charges crud ----------------
router.post(
  "/single-session_charges/add", 
  doctorSingleSessionChargesController.add
);
router.get(
  "/single-session_charges/getAll", 
  doctorSingleSessionChargesController.get
);
router.delete(
  "/single-session_charges/delete/:itemId", 
  doctorSingleSessionChargesController.deleteData
);
router.put(
  "/single-session_charges/update/:itemId", 
  doctorSingleSessionChargesController.updateDate
);
// --------------------- single session charges crud ----------------



// =================================== new code --

// --------------------- session ----------------
// router.post("/session/create", doctorSessionController.createSession);
// router.post(
//   "/session/previous_messages",
//   doctorSessionController.previous_messages
// );
// router.post("/session/add_message", doctorSessionController.add_message);
// router.post("/session/close_session", doctorSessionController.close_session);
// router.post(
//   "/session/addprescriptionimage",
//   doctorSessionController.addprescriptionimage
// );
// router.get("/session_history", doctorSessionController.sessionHistory);
// --------------------- session ----------------

// --------------------- wallet ----------------
router.get(
  "/wallet/getcurrentbalance",
  doctorProfileController.getcurrentbalance
);
// --------------------- wallet ----------------

// --------------------- podcast ----------------
router.post("/podcast/start", doctorPodcastController.startPodCast);
router.post("/podcast/stop", doctorPodcastController.stopPodCast);
// --------------------- podcast ----------------

// ------------------------- galleries --------------------
router.post("/gallery/add", doctorGalleryController.addGalleryImage);
router.get("/gallery/get", doctorGalleryController.getGalleryImages);
router.delete(
  "/gallery/delete/:itemId",
  doctorGalleryController.deleteGalleryImage
);
// ------------------------- galleries --------------------

module.exports = router;
