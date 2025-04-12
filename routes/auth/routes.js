const router = require("express").Router();
const rateLimit = require("express-rate-limit");

const adminLoginController = require("../../controller/auth/adminLogin");
const adminMiddleWare = require("../../middleware/admin.middleware");

const userLoginController = require("../../controller/auth/userLogin");
const userMiddleWare = require("../../middleware/patient.middleware");

const doctorRegistrationController = require("../../controller/doctor/registrationform");
const doctorMiddleWare = require("../../middleware/doctor.middleware");

const serviceProviderLoginController = require("../../controller/auth/serviceProviderLogin");
const serviceProviderMiddleWare = require("../../middleware/serviceProvider.middleware"); 

// Define rate limiting for a specific route
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per 15 minutes
  message: "Too many requests from this IP, please try again later.",
});



// ===================== admin -----------------
router.post(
  "/verify-token",
  adminMiddleWare.authenticateToken,
  adminLoginController.handleVerifyToken
);
router.post("/admin/login", limiter, adminLoginController.handleAdminLogin);
router.post(
  "/admin/forget-password",
  limiter,
  adminLoginController.handleAdminPassword
);
router.post(
  "/admin/forget_password_verify",
  limiter,
  adminLoginController.handleAdminPasswordVerify
);
router.post(
  "/admin/forget-password-update",
  adminMiddleWare.authenticateToken,
  adminLoginController.handleAdminPasswordUpdate
);
// ===================== admin -----------------

// ===================== user -----------------
router.post("/user/sendloginotp", limiter, userLoginController.handleSendOtp);
router.post(
  "/user/verifysendloginotp",
  limiter,
  userLoginController.handleVerifyOtp
);
router.post(
  "/user/sendloginrequest",
  userLoginController.handleSendloginrequest
);
router.post(
  "/user/verifypatienttoken",
  userMiddleWare.authenticateToken,
  userLoginController.verifypatienttoken
);
// ===================== user -----------------
// ===================== doctor -----------------
router.post(
  "/doctor/verifyDoctorTokentoken",
  doctorMiddleWare.authenticateToken,
  doctorRegistrationController.verifyDoctorToken
);
router.post(
  "/doctor/getnewtoken",
  doctorRegistrationController.returnNewDoctorToken
);
// ===================== doctor -----------------

// ===================== service provider -----------------
router.post(
  "/serviceProvider/sendloginotp",
  limiter,
  serviceProviderLoginController.handleSendOtp
);
router.post(
  "/serviceProvider/sendloginotptoemail",
  limiter,
  serviceProviderLoginController.handleSendOtptoEmail
);
router.post(
  "/serviceProvider/verifysendloginotp",
  limiter,
  serviceProviderLoginController.handleVerifyOtp
);
router.post(
  "/serviceProvider/sendloginrequest",
  limiter,
  serviceProviderLoginController.handleSendloginrequest
);
router.post(
  "/serviceProvider/verifyserviceProvidertoken",
  serviceProviderMiddleWare.authenticateToken,
  serviceProviderLoginController.verifyserviceProvidertoken
);
// ===================== service provider -----------------

module.exports = router;
