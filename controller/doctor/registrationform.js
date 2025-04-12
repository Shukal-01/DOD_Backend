const handleCreate = require("../../helper/crudHelpers/handleCreate");
const doctorRegistrationModel = require("../../model/doctorRegistration.model");
const patientModel = require("../../model/patients.model");
const { generateAccessToken } = require("../../middleware/doctor.middleware");
const doctorModel = require("../../model/doctors.model");
const { sendSuccess, sendError } = require("../_utils/req_res_messages");

const saveForm = (req, res) => {
  // console.log(req.body);

  handleCreate(
    req,
    res,
    doctorRegistrationModel,
    [],
    { status: "pending" },
    ""
  );
};

const getdoctorregistrationformstatus = async (req, res) => {
  try {
    const { id, mobileNumber } = req.body;

    const doctor = await doctorModel.findOne({
      $or: [
        { patientId: id, patientMobileNumber: mobileNumber },
        { professionalNumber: mobileNumber },
      ],
    });

    if (doctor) {
      return sendSuccess(res, 200, doctor.status, ""); //verified |    blocked
    }

    // find in registrations

    const isRegistrationRequestExist = await doctorRegistrationModel.findOne({
      patientId: id,
    });
    if (isRegistrationRequestExist) {
      return sendSuccess(res, 200, isRegistrationRequestExist.status, ""); // pending , rejected
    }

    return sendSuccess(res, 200, "newapplication", ""); // newapplication
  } catch (error) {
    console.error("Error in getdoctorregistrationformstatus:", error);
    return sendError(res, 404, error.message);
  }
};

const verifyDoctorToken = async (req, res) => {
  let user = req.user.userData;

  const doctorId = req.user.userData._id;

  const proFileData = await doctorModel.findOne({ _id: doctorId });
  if (proFileData) {
    let userData = user;
    return res.status(200).json({
      message: "success",
      data: { userData: userData },
    });
  } else {
    res.status(400).send("Invalid token !");
  }
};

const returnNewDoctorToken = async (req, res) => {
  try {
    const { id, mobileNumber } = req.body;

    let doctorData = await doctorModel.findOne({
      $or: [{ patientId: id }],
    });

    if (!doctorData) {
      doctorData = await doctorModel.findOne({
        professionalNumber: mobileNumber,
      });

      if (doctorData) {
        const patientData = await patientModel.findOne({
          mobileNumber: mobileNumber,
        });
        await doctorModel.findByIdAndUpdate(doctorData._id, {
          patientId: patientData._id,
          patientMobileNumber: patientData.mobileNumber,
        });
      }
    }
    if (!doctorData) {
      return sendError(res, 200, "Doctor not found!");
    }
    const token = generateAccessToken(doctorData);

    sendSuccess(res, 200, token, "");
  } catch (error) {
    return sendError(res, 404, e.message);
  }
};

module.exports = {
  saveForm,
  getdoctorregistrationformstatus,
  verifyDoctorToken,
  returnNewDoctorToken,
};
