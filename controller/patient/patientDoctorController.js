const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
const handleUpdateNew2 = require("../../helper/crudHelpers/new/UpdateNew2");
const handleUpdate = require("../../helper/crudHelpers/Update");
const {
  sendSuccess,
  sendError,
} = require("../../helper/other/Req_Res_Search_function");
const doctorSingleSessionChargesModel = require("../../model/doctor/doctorSingleSessionCharges");
const patientModel = require("../../model/patients.model");

const likeDoctor = async (req, res) => {
  const patientId = req.user.userData._id;
  const patientData = await patientModel.findOne({ _id: patientId });
  let newArr = [];
  if (patientData.likedDoctorArr && patientData.likedDoctorArr.length > 0) {
    newArr = patientData.likedDoctorArr;
  }
  newArr.push(req.body.doctorId);
  const isUpdated = await handleUpdateNew2(
    req,
    patientModel,
    ["patientId", "doctorId"],
    { likedDoctorArr: newArr },
    "",
    {
      _id: patientId,
    }
  );

  if (isUpdated.message == "success") {
    return sendSuccess(res, 200, isUpdated.data.likedDoctorArr, "");
  } else {
    return sendError(res, 200, isUpdated.error ?? "something went wrong!");
  }
};

const dislikeDoctor = async (req, res) => {
  const patientId = req.user.userData._id;
  const patientData = await patientModel.findOne({ _id: patientId });
  let newArr = [];
  if (patientData.likedDoctorArr && patientData.likedDoctorArr.length > 0) {
    newArr = patientData.likedDoctorArr.filter(
      (value) => value !== req.body.doctorId
    );
  }

  const isUpdated = await handleUpdateNew2(
    req,
    patientModel,
    ["patientId", "doctorId"],
    { likedDoctorArr: newArr },
    "",
    {
      _id: patientId,
    }
  );

  if (isUpdated.message == "success") {
    return sendSuccess(res, 200, isUpdated.data.likedDoctorArr, "");
  } else {
    return sendError(res, 200, isUpdated.error ?? "something went wrong!");
  }
};

const handleGetDoctorsSessionChargesList = async (req, res) => {
  try {
    const { doctorId } = req.params;

    handleGetWithMsg(req, res, doctorSingleSessionChargesModel, {
      doctorId: doctorId,
      status: 1,
    });
  } catch (error) {
    return sendError(res, 200, "");
  }
};

module.exports = {
  likeDoctor,
  dislikeDoctor,
  handleGetDoctorsSessionChargesList,
};
