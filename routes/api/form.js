const router = require("express").Router();

const doctorRegisterform = require("../../controller/doctor/registrationform");

// ------------ doctor registration  form ----------------
router.post("/doctorregistrationformsave", doctorRegisterform.saveForm);
router.post(
  "/getdoctorregistrationformstatus",
  doctorRegisterform.getdoctorregistrationformstatus
);
// ------------ doctor registration  form ----------------

module.exports = router;
