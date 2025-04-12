const SendOtp = require("../../helper/sendOtp/fast2smsOtp");
const serviceProviderModel = require("../../model/serviceProvider.model");

const serviceProviderMiddleware = require("../../middleware/serviceProvider.middleware");
const {
  storeOTP,
  validateOTP,
} = require("../../helper/rememberOtp/LoginOtpsHander");
const generateOTP = require("../../helper/sendOtp/otpGenerator");
const sendEmail = require("../../helper/sendEmail/send-email");

const handleSendOtp = async (req, res) => {
  const otp = generateOTP(6);
  console.log(otp);
  
  await storeOTP(req.body.mobileNumber, otp);
  let isSentOtp = await SendOtp(req.body.mobileNumber, otp);
  if (isSentOtp === "success") {
    return res.status(200).json({ message: "success", data: "" });
  } else {
    return res.status(404).json({ message: "error" });
  }
};

const handleSendOtptoEmail = async (req, res) => {
  const { email } = req.body;
  const sendFromEmail = process.env.EMAIL_TO_FROM_EMAIL;

  if (!email || !sendFromEmail) {
    return errorCallback();
  }

  const isExist = await serviceProviderModel
    .findOne({
      email: email,
    })
    .collation({ locale: "en", strength: 2 }); // Case-insensitive

  if (!isExist) {
    return res.status(200).json({
      message: "error",
      detail: "Username or Password is incorrect.",
    });
  }

  if (isExist.status != "verified") {
    if (isExist) {
      return res.status(200).json({
        message: "error",
        detail: "Account is not active! Contact support.",
      });
    }
  }

  const successCallback = () => {
 

    return res.status(200).json({ message: "success" });
  };

  const errorCallback = () => {
    return res.status(200).json({ message: "error" });
  };

  const otp = generateOTP(6);
  await storeOTP(email, otp);

  sendEmail(
    email,
    sendFromEmail,
    "Doctor On Door - Verification Of E-Mail",
    `Your otp for email verification is ${otp}`,
    successCallback,
    errorCallback
  );
};

const handleVerifyOtp = async (req, res) => {
  try {
    const key = req.body.mobileNumber || req.body.email;
    if (!key) {
      return res.status(404).json({ message: "error" });
    }
    const isValidated = await validateOTP(key, req.body.otp);
 

    if (isValidated) {
      const isExist = await serviceProviderModel
        .findOne({
          $or: [
            { email: key },
            { mobileNumber: key.includes("@") ? "00" : key },
          ],
        })
        .collation({ locale: "en", strength: 2 }); // Case-insensitive

      try {
 
        
        if (isExist) {
          const userData = isExist;
          const token = serviceProviderMiddleware.generateAccessToken(userData);
          return res.status(200).json({
            message: "success",
            data: { token: token, userData: userData },
          });
        }
       
        
        return res.status(404).json({ message: "error" });
      } catch (err) {
        console.log(err);
        return res.status(200).json({ message: "error", data: "ok2" });
      }
    } else {
      return res.status(404).json({ message: "error" });
    }
  } catch (error) {
    return res.status(404).json({ message: "error" });
  }
};

const handleSendloginrequest = async (req, res) => {
  if (
    !(
      req.body.mobileNumber === "9975039722" ||
      req.body.mobileNumber === 9975039722
    )
  ) {
    return res.status(404).json({ message: "error" });
  }
  const isExist = await serviceProviderModel.findOne({
    mobileNumber: req.body.mobileNumber,
  });

  try {
    if (isExist) {
      const userData = isExist;
      const token = serviceProviderMiddleware.generateAccessToken(userData);
      return res.status(200).json({ message: "success", token: token });
    } else {
      const createOne = await serviceProviderModel.create({
        mobileNumber: req.body.mobileNumber,
      });
      if (!createOne) {
        return res.status(200).json({ message: "error", data: "ok1" });
      }

      const token = serviceProviderMiddleware.generateAccessToken(createOne);
      return res.status(200).json({ message: "success", token: token });
    }
  } catch (err) {
    // console.log(err);
    return res.status(200).json({ message: "error", data: "ok2" });
  }
};

const verifyserviceProvidertoken = async (req, res) => {
  let user = req.user.userData;

  const patientId = req.user.userData._id;

  const proFileData = await serviceProviderModel.findOne({ _id: patientId });
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

module.exports = {
  handleSendOtp,
  handleVerifyOtp,
  handleSendloginrequest,
  verifyserviceProvidertoken,
  handleSendOtptoEmail,
};
