const doctorRegistrationModel = require("../../model/doctorRegistration.model");
const doctorModel = require("../../model/doctors.model");
const patientModel = require("../../model/patients.model");

// ----------------------------------------------------------------
// crud handlers
const handleDelete = require("../../helper/crudHelpers/Delete");
const handleUpdate = require("../../helper/crudHelpers/Update");
// ----------------------------------------------------------------

const get = async (req, res) => {
  let data = await doctorRegistrationModel.find({ status: "pending" });
  return res.status(200).json({ message: "success", data: data });
};

const deleteData = async (req, res) => {
  handleDelete(req, res, doctorRegistrationModel, { _id: req.params.itemId });
};
const updateDate = async (req, res) => {
  const givenStatus = req.body.status;

  if (!givenStatus) {
    return res.status(200).json({ message: "error", detail: "invalid status" });
  }

  if (givenStatus === "reject") {
    handleUpdate(req, res, doctorRegistrationModel, [], {}, "", {
      _id: req.params.itemId,
    });
  } else if (givenStatus === "verified") {
    let doctorRequestData = await doctorRegistrationModel.findOne({
      _id: req.params.itemId,
    });

    let patient = await patientModel.findOne({
      _id: doctorRequestData.patientId,
    });

    const newDoctorObj = {
      patientId: patient._id,
      patientMobileNumber: patient.mobileNumber,
      name: doctorRequestData.name,
      professionalNumber: doctorRequestData.mobileNumber,
      department: doctorRequestData.department,
      professionalEmailAddress: doctorRequestData.professionalEmailAddress,
      specialization: doctorRequestData.specialization,
      experience: doctorRequestData.experience,
      education: doctorRequestData.education,
      workingStatus: doctorRequestData.workingStatus,
      workAddress: doctorRequestData.workAddress,
      workPlaceName: doctorRequestData.workPlaceName,
      certificate: doctorRequestData.certificate,
      // ---------------------------------------------------
      experienceDescription: doctorRequestData.experienceDescription,
      aboutDescription: doctorRequestData.aboutDescription,
      city: doctorRequestData.city,
      state: doctorRequestData.state,
      country: doctorRequestData.country,
      languagesSpoken: doctorRequestData.languagesSpoken,
      // ---------------------------------------------------
      isOnline: 0,
      chatStatus: 0,
      videoCallStatus: 0,
      callStatus: 0,
      isLive: 0,
      // ---------------------------------------------------
      status: "verified",
    };

    let createNewDoctor = await doctorModel.create(newDoctorObj);
    if (!createNewDoctor) {
      return res
        .status(200)
        .json({ message: "error", detail: "doctor not created" });
    }

    // update patient
    patient.doctorVerificationStatus = "verified";
    patient.doctorId = createNewDoctor._id;

    const isPatientUpdated = await patient.save();

    if (!isPatientUpdated) {
      return res
        .status(200)
        .json({ message: "error", detail: "User not updated" });
    }

    const deleteRequest = await doctorRegistrationModel.deleteOne({
      _id: req.params.itemId,
    });

    if (!deleteRequest) {
      return res
        .status(200)
        .json({ message: "error", detail: "request not deleted" });
    }

    return res.status(200).json({ message: "success", data: "" });
  }
};

module.exports = { get, deleteData, updateDate };
