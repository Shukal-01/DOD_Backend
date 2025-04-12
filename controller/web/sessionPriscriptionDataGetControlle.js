const { sendSuccess } = require("../../helper/other/Req_Res_Search_function");
const doctorPatientSessionModel = require("../../model/_new/doctor_patient_sesstion");
const doctorModel = require("../../model/doctors.model");
const patientModel = require("../../model/patients.model");
const serviceProviderModel = require("../../model/serviceProvider.model");
const { sendError } = require("../_utils/req_res_messages");

const handleGetRequiredPriscriptionData = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return sendError(res, 200, "error");
    }
    const sessionData = await doctorPatientSessionModel.findById(sessionId);
    if (!sessionData) {
      return sendError(res, 200, "error");
    }

    const patientData = await patientModel.findById(sessionData.patientId);
    const doctorData = await doctorModel.findById(sessionData.doctorId);

    let organizationName = "";

    if (sessionData._targetDoctorOrOrganization === "organization") {
      const serviceProviderData = await serviceProviderModel.findById(
        sessionData._targetId
      );
      organizationName = serviceProviderData.name;
    }

    return sendSuccess(res, 200, {
      doctorName: doctorData.name,
      yearOfExperience: doctorData.experience,
      medicalSertificateNumber: doctorData.certificate,
      patientName: `${patientData.firstName} ${patientData.lastName}`,
      sessionStartDate: sessionData.startTime,
      organizationName: organizationName,
    });
  } catch (error) {
    return sendError(res, 200, "error");
  }
};

const sessionPriscriptionDataGetController = {
  handleGetRequiredPriscriptionData,
};

module.exports = sessionPriscriptionDataGetController;
