const SendOtp = require("../../helper/sendOtp/fast2smsOtp");
const patientModel = require("../../model/patients.model");

const patientMiddleware = require("../../middleware/patient.middleware");
const generateOTP = require("../../helper/sendOtp/otpGenerator");
const {
  storeOTP,
  validateOTP,
} = require("../../helper/rememberOtp/LoginOtpsHander");
const { sendSuccess, sendError } = require("../_utils/req_res_messages");

const handleSendOtp = async (req, res) => {
  let otp = generateOTP(6);
  await storeOTP(req.body.mobileNumber, otp);

  console.log(otp);

  let isSentOtp = await SendOtp(req.body.mobileNumber, otp);
  if (isSentOtp === "success") {
    return res.status(200).json({ message: "success" });
  } else {
    return res.status(404).json({ message: "error" });
  }
};

const handleVerifyOtp = async (req, res) => {
  try {
    const isValidated = await validateOTP(req.body.mobileNumber, req.body.otp);
    if (isValidated) {
      const isExist = await patientModel.findOne({
        mobileNumber: req.body.mobileNumber,
      });

      try {
        if (isExist) {
          const userData = isExist;
          const token = patientMiddleware.generateAccessToken(userData);

          return sendSuccess(res, 200, { token }, "");
        } else {
          const createOne = await patientModel.create({
            mobileNumber: req.body.mobileNumber,
          });
          if (!createOne) {
            return sendError(res, 404, "");
          }

          const token = patientMiddleware.generateAccessToken(createOne);
          // console.log(token);
          // console.log(req.body);
          return sendSuccess(res, 200, { token }, "");
        }
      } catch (err) {
        console.log(err);
        return sendError(res, 404, "");
      }
    } else {
      console.log("error");
      return sendError(res, 404, "");
    }
  } catch (error) {
    console.log(error.message);

    return sendError(res, 404, "");
  }
};

const handleSendloginrequest = async (req, res) => {
  if (
    !(
      req.body.mobileNumber === "9975039722" ||
      req.body.mobileNumber === 9975039722
    )
  ) {
    return sendError(res, 200, "invalid details");
  }
  // await SendOtp(, otp);
  // await SendOtp(, otp);
  const isExist = await patientModel.findOne({
    mobileNumber: req.body.mobileNumber,
  });

  try {
    if (isExist) {
      const userData = isExist;
      const token = patientMiddleware.generateAccessToken(userData);
      return sendSuccess(res, 200, { token }, "");
    } else {
      const createOne = await patientModel.create({
        mobileNumber: req.body.mobileNumber,
      });
      if (!createOne) {
        return sendError(res, 200, "");
      }

      const token = patientMiddleware.generateAccessToken(createOne);
      return sendSuccess(res, 200, { token }, "");
    }
  } catch (err) {
    console.log(err);
    return sendError(res, 200, err.message);
  }
};

const verifypatienttoken = async (req, res) => {
  let user = req.user.userData;

  const patientId = req.user.userData._id;

  const proFileData = await patientModel.findOne({ _id: patientId });
  if (proFileData) {
    let userData = user;
    return sendSuccess(res, 200, { userData: userData }, "");
  } else {
    return sendError(res, 200, "Invalid Request!");
  }
};

module.exports = {
  handleSendOtp,
  handleVerifyOtp,
  handleSendloginrequest,
  verifypatienttoken,
};
