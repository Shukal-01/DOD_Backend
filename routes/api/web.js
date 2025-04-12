const router = require("express").Router();
const { handleSearch } = require("../../controller/patient/searchController");
const AccountDeletecontroller = require("../../controller/web/accountDeleteRequestController");
const appDetailsController = require("../../controller/web/app_details_controller");
const contactRequestController = require("../../controller/web/contactRequestController");
const {
  getDepartmentData,
  getDoctorsData,
  getSpecializationData,
  getAllCountries,
  getAllStates,
  getAllCities,
  getAllServiceProviderTypes,
  getAllMedicalServices,
  getAllmedicalserviceProviders,
  getAllEvents,
  getDepartmentDataWithStatus,
  getSpecializationDataWithMsg,
} = require("../../controller/web/getData");
const sessionPriscriptionDataGetController = require("../../controller/web/sessionPriscriptionDataGetControlle");
const { saveForm } = require("../../controller/web/webDoctorRegistrationForm");

router.post("/contact/save", contactRequestController.add);
router.get("/data/alldepartments", getDepartmentData);
router.get("/data/alldepartments-msg", getDepartmentDataWithStatus);
router.get("/data/allspecializations", getSpecializationData);
router.get("/data/allspecializations-msg", getSpecializationDataWithMsg);
router.get("/data/alldoctors", getDoctorsData);

// ------------------------------ data
router.get("/data/allcountries", getAllCountries);
router.get("/data/allstates", getAllStates);
router.get("/data/allcities", getAllCities);
router.get("/data/allEvents", getAllEvents);

// ------------------------------ service provider registration form
router.get("/data/allserviceprovidertypes", getAllServiceProviderTypes);
router.get("/data/allmedicalservices", getAllMedicalServices);
router.get("/data/allmedicalserviceProviders", getAllmedicalserviceProviders);
// ------------------------------ service provider registration form
// ------------------------------ data

// ------------------------------ doctor registration form
router.post("/doctorregistrationform/save", saveForm); 
// ------------------------------ doctor registration form

// ------------------------------ doctor / patient priscription information get
router.post("/session/priscription-data/getall",sessionPriscriptionDataGetController.handleGetRequiredPriscriptionData );
// ------------------------------ doctor / patient priscription information get

// ------------------------------ Account Delete Request
router.post(
  "/account_delete_request/save",
  AccountDeletecontroller.saveNewAccountDeleteRequest
);
// ------------------------------ Account Delete Request

// ===================== apk details -----------------
// user ( doctor-patient app)
router.get(
  "/app-details/user_app",
  appDetailsController.handleGetUserAppDetails
);
router.get(
  "/app-details/service-provicer_app",
  appDetailsController.handleGetUserAppDetails
);
// ===================== apk details -----------------

module.exports = router;
