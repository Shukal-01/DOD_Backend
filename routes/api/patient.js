const patientProfileController = require("../../controller/patient/profile");
const patientPodcastController = require("../../controller/patient/patientPodcastController");
const patientMedicalServiceController = require("../../controller/patient/patientMedicalServicesController");
const patientDoctorController = require("../../controller/patient/patientDoctorController");
const serviceProviderController = require("../../controller/patient/serviceProviderController");
const doctorController = require("../../controller/patient/doctorController");
const appReviewController = require("../../controller/patient/appReviewController");
const searchController = require("../../controller/patient/searchController");
const walletSystemController = require("../../controller/patient/walletSystemController");
const patientSessionConroller = require("../../controller/patient/new/patientSessionConroller");
const patientPaymentController = require("../../controller/patient/new/patientPaymentController");

const router = require("express").Router();

router.put("/updateprofile", patientProfileController.updatePatientProfile);
router.put("/update-image", patientProfileController.updatePatientProfile);
router.get("/getprofiledata", patientProfileController.getprofiledata);

// router.get('/sessionMessage', patientProfileController.getprofiledata)

// ======= > new
// --------------------------------------------------------------- Session
router.post(
  "/api/session/create-new-request",
  patientSessionConroller.createNewRequest
);
router.get(
  "/api/session/get-session-data/:sessionId",
  patientSessionConroller.handleGetSessionDataForPatient
);
router.put(
  "/api/session/patient-cancel-session/:sessionId",
  patientSessionConroller.handleCancelSessionRequestFromPatientSide
);
router.get(
  "/api/session/unfulfilled-session-data",
  patientSessionConroller.handleGetUnfulfilledPatientSession
);
router.put(
  "/api/session/mark_fulfilled-session-data/:sessionId",
  patientSessionConroller.handleFulfilledSessionRequest
);
router.put(
  "/api/session/accept-join-session/:sessionId",
  patientSessionConroller.handlePatientAcceptAndJoinSession
);
router.put(
  "/api/session/add-message-session/:sessionId",
  patientSessionConroller.handleAddMessageToSession
);
router.get(
  "/api/session/get-message-session/:sessionId",
  patientSessionConroller.handleGetMessagesOfSession
);
router.put(
  "/api/session/end-session/:sessionId",
  patientSessionConroller.handleEndSession
);
router.get(
  "/api/session/get-session-history",
  patientSessionConroller.handleGetSessionHistory
);

// -- service providers
router.get(
  "/api/service-provider/get-all/:categoryId",
  serviceProviderController.getThisCategoryServiceProviders
);

router.get(
  "/api/service-provider/get-all-advertised",
  serviceProviderController.getAllCategoriesAdvertiesedServiceProviders
);
// -- service providers

// --------------------- order Payment systems ----------------
router.post(
  "/api/payment/newpaymentorderrequest",
  patientPaymentController.newpaymentorderrequest
);
router.post(
  "/api/payment/savecompletedpayment",
  patientPaymentController.savecompletedpayment
);
router.post(
  "/api/payment/handleupdateerroredpayment",
  patientPaymentController.handleupdateerroredpayment
);
router.get(
  "/api/payment/get_my_topup_payment_history",
  patientPaymentController.handleGetMyTopupPaymentHistory
);
// --------------------- order Payment systems ----------------

// --------------------- doctors side ----------------
router.get(
  "/api/doctor/get-doctors_charges_list/:doctorId",
  patientDoctorController.handleGetDoctorsSessionChargesList
);

// --------------------- doctor like and dislike ----------------
router.post("/likethisdoctor", patientDoctorController.likeDoctor);
router.post("/dislikethisdoctor", patientDoctorController.dislikeDoctor);
// --------------------- doctor like and dislike ----------------

// ---------------------  doctor Rating services ----------------
router.post("/doctor/rating/add", doctorController.addNewRating);
router.get("/doctor/rating/get/:doctorId", doctorController.getAllRatings);
// ---------------------  doctor Rating services ----------------

// ---------------------  serviceProvider Rating services ----------------
router.post(
  "/serviceprovider/rating/add",
  serviceProviderController.addNewRating
);
router.get(
  "/serviceprovider/rating/get/:serviceProviderId",
  serviceProviderController.getAllRatings
);
// ---------------------  serviceProvider Rating services ----------------

// ---------------------  service providr making call ----------------
router.get(
  "/serviceprovider/actions/call-check_isonline/:serviceProviderId",
  serviceProviderController.handleCheckIsServiceProviderOnline
);
// ---------------------  serviceProvider making calls ----------------

// ---------------------  organizations doctor services ----------------
router.get(
  "/serviceprovider/organization/working-doctors/:serviceProviderId",
  serviceProviderController.getAllDoctorsOfThisOrganization
);
// ---------------------  organizations doctor services ----------------

// ========== old -->

// --------------------- session ----------------
// router.post(
//   "/session/previous_messages",
//   patientSessionController.previous_messages
// );
// router.post("/session/add_message", patientSessionController.add_message);
// router.post("/session/close_session", patientSessionController.close_session);
// router.get("/session_history", patientSessionController.session_history);
// --------------------- session ----------------

// --------------------- Podcast ----------------
router.get("/podcast/get/:itemId", patientPodcastController.getPodcastDetails);
// --------------------- Podcast ----------------

// --------------------- medical service section ----------------
router.post(
  "/medicalservice/history/new",
  patientMedicalServiceController.createNewHistory
);
router.get(
  "/getserviceprovidertype",
  patientMedicalServiceController.getServiceprovidertype
);
// --------------------- medical service section ----------------

// ---------------------  serviceProvider gallery services ----------------
router.get(
  "/serviceprovider/getgalleryimages/:_id",
  serviceProviderController.getAllGalleryImages
);
// ---------------------  serviceProvider gallery services ----------------

// ---------------------  serviceProvider gallery services ----------------
router.get(
  "/doctor/getgalleryimages/:_id",
  doctorController.getAllGalleryImages
);
// ---------------------  serviceProvider gallery services ----------------

// ---------------------  serviceProvider services ----------------

router.get(
  "/serviceproviderservices",
  serviceProviderController.getAllServiceProviderServices
);
router.get(
  "/serviceproviderservicecategories",
  serviceProviderController.getAllServiceProviderServiceCategories
);
// ---------------------  serviceProvider services ----------------

// --------------------- App review ----------------
router.post("/appreview/add", appReviewController.addNewReveiw);
router.get("/appreview/getAll", appReviewController.getAllReview);
// --------------------- App review ----------------

// --------------------- search ----------------
router.get("/search/doctor/:searchText", searchController.handleSearchDoctors);
// --------------------- search ----------------

// --------------------- wallet Payment systems ----------------
router.post(
  "/wallet/newpaymentorderrequest",
  walletSystemController.newpaymentorderrequest
);
router.post(
  "/wallet/savecompletedpayment",
  walletSystemController.savecompletedpayment
);
router.post(
  "/wallet/handleupdateerroredpayment",
  walletSystemController.handleupdateerroredpayment
);
router.get("/wallet/getbalance", walletSystemController.getbalance);
router.get("/wallet/gettopuphistory", walletSystemController.gettopuphistory);

// --------------------- wallet Payment systems ----------------

module.exports = router;
