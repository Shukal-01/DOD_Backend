const router = require("express").Router();
const handlePageAccess = require("../../middleware/pageAceess.middleware");

const userController = require("../../controller/admin/userController");
const contactRequestController = require("../../controller/admin/contactRequestController");
const departmentController = require("../../controller/admin/departmentController");
const doctorRegistrationRequestController = require("../../controller/admin/doctorRegistrationRequestController");
const webDoctorRegistrationRequestController = require("../../controller/admin/webDoctorRegistrationRequestController");
const specializationController = require("../../controller/admin/specializationController");
const languageController = require("../../controller/admin/languageController");
const serviceprovidertypeController = require("../../controller/admin/serviceprovidertypeController");
const medicalservicesController = require("../../controller/admin/medicalservicesController");
const serviceProviderRegistrationRequestController = require("../../controller/admin/serviceProviderRegistrationRequestController");
const eventController = require("../../controller/admin/eventController");
const doctorController = require("../../controller/admin/doctorController");
const serviceproviderservicecategoriesController = require("../../controller/admin/serviceproviderservicecategoriesController");
const serviceproviderserviceController = require("../../controller/admin/serviceproviderserviceController");
// ---------- location ----------
const countryController = require("../../controller/admin/myCountryController");
const stateController = require("../../controller/admin/stateController");
const cityController = require("../../controller/admin/cityController");
// ---------- location ----------

// ------------------ roles
const roleArray = ["add", "view", "delete", "update"];
const allRoles = [
  "user",
  "contact_request",
  "department",
  "doctorregistration",
  "webdoctorregistration",
  "specialization",
  "languages",
  "serviceprovidertype",
  "medicalservices",
  "country",
  "state",
  "city",
  "serviceProvider",
  "event",
  "doctor",
  "serviceproviderservicecategories",
  "serviceproviderservice",
];
router.get("/roles/getAll", (req, res) => {
  res.status(200).json({ message: "success", data: allRoles });
});
// ------------------ roles

// ------------------ user
router.post(
  "/user/add",
  handlePageAccess(allRoles[0], roleArray[0]),
  userController.add
);
router.get(
  "/user/getAll",
  handlePageAccess(allRoles[0], roleArray[1]),
  userController.get
);
router.delete(
  "/user/delete/:itemId",
  handlePageAccess(allRoles[0], roleArray[2]),
  userController.deleteData
);
router.put(
  "/user/update/:itemId",
  handlePageAccess(allRoles[0], roleArray[3]),
  userController.updateDate
);
// ------------------ user

// ------------------ contact requests
router.get(
  "/contact_request/getAll",
  handlePageAccess(allRoles[1], roleArray[1]),
  contactRequestController.get
);
router.delete(
  "/contact_request/delete/:itemId",
  handlePageAccess(allRoles[1], roleArray[2]),
  contactRequestController.deleteData
);
router.put(
  "/contact_request/update/:itemId",
  handlePageAccess(allRoles[1], roleArray[3]),
  contactRequestController.updateDate
);
// ------------------ contact requests

// ------------------ department
router.post(
  "/department/add",
  handlePageAccess(allRoles[2], roleArray[0]),
  departmentController.add
);
router.get(
  "/department/getAll",
  handlePageAccess(allRoles[2], roleArray[1]),
  departmentController.get
);
router.delete(
  "/department/delete/:itemId",
  handlePageAccess(allRoles[2], roleArray[2]),
  departmentController.deleteData
);
router.put(
  "/department/update/:itemId",
  handlePageAccess(allRoles[2], roleArray[3]),
  departmentController.updateDate
);
// ------------------ department

// ------------------ doctorregistration
// router.post(
//   "/doctorregistration/add",
//   handlePageAccess(allRoles[3], roleArray[0]),
//   doctorRegistrationRequestController.add
// );
router.get(
  "/doctorregistration/getAll",
  handlePageAccess(allRoles[3], roleArray[1]),
  doctorRegistrationRequestController.get
);
router.delete(
  "/doctorregistration/delete/:itemId",
  handlePageAccess(allRoles[3], roleArray[2]),
  doctorRegistrationRequestController.deleteData
);
router.put(
  "/doctorregistration/update/:itemId",
  handlePageAccess(allRoles[3], roleArray[3]),
  doctorRegistrationRequestController.updateDate
);
// ------------------ doctorregistration

// ------------------ webdoctorregistration
// router.post(
//   "/doctorregistration/add",
//   handlePageAccess(allRoles[3], roleArray[0]),
//   doctorRegistrationRequestController.add
// );
router.get(
  "/webdoctorregistration/getAll",
  handlePageAccess(allRoles[4], roleArray[1]),
  webDoctorRegistrationRequestController.get
);
router.delete(
  "/webdoctorregistration/delete/:itemId",
  handlePageAccess(allRoles[4], roleArray[2]),
  webDoctorRegistrationRequestController.deleteData
);
router.put(
  "/webdoctorregistration/update/:itemId",
  handlePageAccess(allRoles[4], roleArray[3]),
  webDoctorRegistrationRequestController.updateDate
);
// ------------------ webdoctorregistration

// ------------------ specialization
router.post(
  "/specialization/add",
  handlePageAccess(allRoles[5], roleArray[0]),
  specializationController.add
);
router.get(
  "/specialization/getAll",
  handlePageAccess(allRoles[5], roleArray[1]),
  specializationController.get
);
router.delete(
  "/specialization/delete/:itemId",
  handlePageAccess(allRoles[5], roleArray[2]),
  specializationController.deleteData
);
router.put(
  "/specialization/update/:itemId",
  handlePageAccess(allRoles[5], roleArray[3]),
  specializationController.updateDate
);
// ------------------ specialization

// ------------------ languages
router.get(
  "/languages/getAll",
  handlePageAccess(allRoles[6], roleArray[1]),
  languageController.get
);
// ------------------ languages

// ------------------ serviceprovidertype
router.post(
  "/serviceprovidertype/add",
  handlePageAccess(allRoles[7], roleArray[0]),
  serviceprovidertypeController.add
);
router.get(
  "/serviceprovidertype/getAll",
  handlePageAccess(allRoles[7], roleArray[1]),
  serviceprovidertypeController.get
);
router.delete(
  "/serviceprovidertype/delete/:itemId",
  handlePageAccess(allRoles[7], roleArray[2]),
  serviceprovidertypeController.deleteData
);
router.put(
  "/serviceprovidertype/update/:itemId",
  handlePageAccess(allRoles[7], roleArray[3]),
  serviceprovidertypeController.updateDate
);
// ------------------ serviceprovidertype

// ------------------ medicalservices
router.post(
  "/medicalservices/add",
  handlePageAccess(allRoles[8], roleArray[0]),
  medicalservicesController.add
);
router.get(
  "/medicalservices/getAll",
  handlePageAccess(allRoles[8], roleArray[1]),
  medicalservicesController.get
);
router.delete(
  "/medicalservices/delete/:itemId",
  handlePageAccess(allRoles[8], roleArray[2]),
  medicalservicesController.deleteData
);
router.put(
  "/medicalservices/update/:itemId",
  handlePageAccess(allRoles[8], roleArray[3]),
  medicalservicesController.updateDate
);
// ------------------ medicalservices
// ------------------ medicalservices
router.post(
  "/country/add",
  handlePageAccess(allRoles[9], roleArray[0]),
  countryController.add
);
router.get(
  "/country/getAll",
  handlePageAccess(allRoles[9], roleArray[1]),
  countryController.get
);
router.delete(
  "/country/delete/:itemId",
  handlePageAccess(allRoles[9], roleArray[2]),
  countryController.deleteData
);
router.put(
  "/country/update/:itemId",
  handlePageAccess(allRoles[9], roleArray[3]),
  countryController.updateDate
);
// ------------------ medicalservices
// ------------------ medicalservices
router.post(
  "/state/add",
  handlePageAccess(allRoles[10], roleArray[0]),
  stateController.add
);
router.get(
  "/state/getAll",
  handlePageAccess(allRoles[10], roleArray[1]),
  stateController.get
);
router.delete(
  "/state/delete/:itemId",
  handlePageAccess(allRoles[10], roleArray[2]),
  stateController.deleteData
);
router.put(
  "/state/update/:itemId",
  handlePageAccess(allRoles[10], roleArray[3]),
  stateController.updateDate
);
// ------------------ medicalservices
// ------------------ medicalservices
router.post(
  "/city/add",
  handlePageAccess(allRoles[11], roleArray[0]),
  cityController.add
);
router.get(
  "/city/getAll",
  handlePageAccess(allRoles[11], roleArray[1]),
  cityController.get
);
router.delete(
  "/city/delete/:itemId",
  handlePageAccess(allRoles[11], roleArray[2]),
  cityController.deleteData
);
router.put(
  "/city/update/:itemId",
  handlePageAccess(allRoles[11], roleArray[3]),
  cityController.updateDate
);
// ------------------ medicalservices
// ------------------ serviceProvider
// router.post(
//   "/serviceProvider/add",
//   handlePageAccess(allRoles[3], roleArray[0]),
//   serviceProviderRegistrationRequestController.add
// );
router.get(
  "/serviceProvider/getAll",
  handlePageAccess(allRoles[12], roleArray[1]),
  serviceProviderRegistrationRequestController.get
);
router.delete(
  "/serviceProvider/delete/:itemId",
  handlePageAccess(allRoles[12], roleArray[2]),
  serviceProviderRegistrationRequestController.deleteData
);
router.put(
  "/serviceProvider/update/:itemId",
  handlePageAccess(allRoles[12], roleArray[3]),
  serviceProviderRegistrationRequestController.updateDate
);
// ------------------ serviceProvider

// ------------------ eventController
router.post(
  "/event/add",
  handlePageAccess(allRoles[13], roleArray[0]),
  eventController.add
);
router.get(
  "/event/getAll",
  handlePageAccess(allRoles[13], roleArray[1]),
  eventController.get
);
router.delete(
  "/event/delete/:itemId",
  handlePageAccess(allRoles[13], roleArray[2]),
  eventController.deleteData
);
router.put(
  "/event/update/:itemId",
  handlePageAccess(allRoles[13], roleArray[3]),
  eventController.updateDate
);
// ------------------ eventController
// ------------------ doctorController
// router.post(
//   "/doctor/add",
//   handlePageAccess(allRoles[3], roleArray[0]),
//   doctorController.add
// );
router.get(
  "/doctor/getAll",
  handlePageAccess(allRoles[14], roleArray[1]),
  doctorController.get
);
router.delete(
  "/doctor/delete/:itemId",
  handlePageAccess(allRoles[14], roleArray[2]),
  doctorController.deleteData
);
router.put(
  "/doctor/update/:itemId",
  handlePageAccess(allRoles[14], roleArray[3]),
  doctorController.updateDate
);
// ------------------ doctorController

// ------------------ serviceproviderservicecategories
router.post(
  "/serviceproviderservicecategories/add",
  handlePageAccess(allRoles[15], roleArray[0]),
  serviceproviderservicecategoriesController.add
);
router.get(
  "/serviceproviderservicecategories/getAll",
  handlePageAccess(allRoles[15], roleArray[1]),
  serviceproviderservicecategoriesController.get
);
router.delete(
  "/serviceproviderservicecategories/delete/:itemId",
  handlePageAccess(allRoles[15], roleArray[2]),
  serviceproviderservicecategoriesController.deleteData
);
router.put(
  "/serviceproviderservicecategories/update/:itemId",
  handlePageAccess(allRoles[15], roleArray[3]),
  serviceproviderservicecategoriesController.updateDate
);
// ------------------ serviceproviderservicecategories
// ------------------ serviceproviderservice
router.post(
  "/serviceproviderservice/add",
  handlePageAccess(allRoles[16], roleArray[0]),
  serviceproviderserviceController.add
);
router.get(
  "/serviceproviderservice/getAll",
  handlePageAccess(allRoles[16], roleArray[1]),
  serviceproviderserviceController.get
);
router.delete(
  "/serviceproviderservice/delete/:itemId",
  handlePageAccess(allRoles[16], roleArray[2]),
  serviceproviderserviceController.deleteData
);
router.put(
  "/serviceproviderservice/update/:itemId",
  handlePageAccess(allRoles[16], roleArray[3]),
  serviceproviderserviceController.updateDate
);
// ------------------ serviceproviderservice

module.exports = router;
