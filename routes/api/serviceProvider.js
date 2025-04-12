const router = require("express").Router();

const serviceProviderProfileController = require("../../controller/serviceProvider/profile");
const callController = require("../../controller/serviceProvider/callController");
const galleryController = require("../../controller/serviceProvider/galleryController");
const servicesController = require("../../controller/serviceProvider/servicesController");
const doctorRegistrationRequestController = require("../../controller/serviceProvider/organizationJobPostController");
const organizationJobPostApplicationsController = require("../../controller/serviceProvider/organizationJobPostApplicationsController");
const organizationsEmployeesDoctorController = require("../../controller/serviceProvider/organizationsEmployeesDoctorController");
const serviceProviderSummaryController = require("../../controller/serviceProvider/summaryController");

// ------------------------- profile data --------------------
router.put(
  "/updateprofile",
  serviceProviderProfileController.updateServiceProviderProfile
);
router.put(
  "/update-image",
  serviceProviderProfileController.updateServiceProviderProfile
);
router.get("/getprofiledata", serviceProviderProfileController.getprofiledata);
// ------------------------- profile data --------------------

// ------------------------- registration verification --------------------
router.get(
  "/checkisverifiedornot",
  serviceProviderProfileController.getprofiledata
);
router.post(
  "/newregistrationrequest",
  serviceProviderProfileController.newregistrationrequest
);
// ------------------------- registration verification --------------------

// ------------------------- call Histories --------------------
router.get("/allCallHistories", callController.getCallHistories);
// ------------------------- call Histories --------------------

// ------------------------- galleries --------------------
router.post("/gallery/add", galleryController.addGalleryImage);
router.get("/gallery/get", galleryController.getGalleryImages);
router.delete("/gallery/delete/:itemId", galleryController.deleteGalleryImage);
// ------------------------- galleries --------------------

// ------------------------- call Histories --------------------
router.get(
  "/allserviceproviderservicecategories",
  servicesController.handleGetAllServiceCategories
);
router.get(
  "/allserviceproviderservices",
  servicesController.handleGetAllServices
);
// ------------------------- call Histories --------------------

// ------------------------- job posts by organizations --------------------
router.post("/organization/jobs/add", doctorRegistrationRequestController.add);
router.get(
  "/organization/jobs/getAll",
  doctorRegistrationRequestController.get
);
router.delete(
  "/organization/jobs/delete/:itemId",
  doctorRegistrationRequestController.deleteData
);
router.put(
  "/organization/jobs/update/:itemId",
  doctorRegistrationRequestController.updateDate
);

// ------------------------- job posts by organizations --------------------

// ------------------------- organization Joined Doctors routes ( working doctors ) --------------------
router.get(
  "/organization/working-doctors/getAll",
  organizationsEmployeesDoctorController.handleGetOrganizationsWorkingDoctors
);
router.put(
  "/organization/working-doctors/update/:itemId",
  organizationsEmployeesDoctorController.updateDateData
);
// ------------------------- organization Joined Doctors routes ( working doctors ) --------------------

// ------------------------- job posts applications by doctor --------------------
router.get(
  "/organization/jobs-applications/getAll/:jobpostid",
  organizationJobPostApplicationsController.getThisJobPostsAllApplication
);
router.put(
  "/organization/jobs-applications/update/:itemId",
  organizationJobPostApplicationsController.updateData
);
router.get(
  "/organization/jobs-applications/get-doctor/:doctorId",
  organizationJobPostApplicationsController.getThisJobPostThisApplicationsDoctorData
);
router.delete(
  "/organization/jobs-applications/delete/:itemId",
  organizationJobPostApplicationsController.deleteData
);
// ------------------------- job posts applications by doctor --------------------

// ------------------------- job posts applications by doctor --------------------
router.get(
  "/summary/dashboard-home",
  serviceProviderSummaryController.handleGetDashboardSummary
);
// ------------------------- job posts applications by doctor --------------------

module.exports = router;
