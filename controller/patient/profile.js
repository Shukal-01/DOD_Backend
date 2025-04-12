const handleUpdateNew2 = require("../../helper/crudHelpers/new/UpdateNew2");
const {
  sendError,
  sendSuccess,
} = require("../../helper/other/Req_Res_Search_function");
const patientModel = require("../../model/patients.model");

const updatePatientProfile = async (req, res) => {
  try {
    const user = req.user.userData;
    const isUpdated = await handleUpdateNew2(
      req,
      patientModel,
      ["image"],
      {},
      "",
      {
        _id: user._id,
      }
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
    // console.log("error 2");
    // console.log(error.message);

    return sendError(res, 400, error.message);
  }
};

const getprofiledata = async (req, res) => {
  const patientId = req.user.userData._id;
  const proFileData = await patientModel.findOne({ _id: patientId });
  sendSuccess(res, 200, { profileData: proFileData }, "");
};

module.exports = { updatePatientProfile, getprofiledata };
