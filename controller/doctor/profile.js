const handleUpdateNew2 = require("../../helper/crudHelpers/new/UpdateNew2");
const handleUpdate = require("../../helper/crudHelpers/Update");
const doctorModel = require("../../model/doctors.model");
const { sendSuccess, sendError } = require("../_utils/req_res_messages");

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.userData._id;
    const isUpdated = await handleUpdateNew2(
      req,
      doctorModel,
      ["status", "patientId", "patientMobileNumber"],
      {},
      "",
      { _id: doctorId }
    );

    if (isUpdated.message === "success") {
      return sendSuccess(res, 200, { profileData: isUpdated.data }, "");
    } else {
      // console.log(isUpdated.error);
      sendError(
        res,
        400,
        isUpdated.error?.message ? isUpdated.error.message : "error"
      );
    }
  } catch (error) {
    // console.log(error.message);

    return sendError(res, 400, error.message);
  }
};

const getprofiledata = async (req, res) => {
  const doctorId = req.user.userData._id;
  const profileData = await doctorModel.findOne({ _id: doctorId });
  return sendSuccess(res, 200, { profileData }, "");
};

// ---------------------------------------------------------------------------------- wallet Related functions
const getcurrentbalance = async (req, res) => {
  const doctorId = req.user.userData._id;
  const proFileData = await doctorModel.findOne({ _id: doctorId });
  const balance = proFileData.currentBalance ? proFileData.currentBalance : 0;
  return res.status(200).json({ message: "success", data: balance });
};
// ---------------------------------------------------------------------------------- wallet Related functions

module.exports = { updateDoctorProfile, getprofiledata, getcurrentbalance };
