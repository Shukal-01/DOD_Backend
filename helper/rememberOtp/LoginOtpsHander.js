// Import the OTP model

const rememberOtpsModel = require("../../model/rememberOtps.model");

// Store OTP in the database with an expiry
async function storeOTP(phoneNumber, otp) {
  try {
    // Upsert: If OTP already exists for the phone number, update it; otherwise, create a new one
    await rememberOtpsModel.findOneAndUpdate(
      { phoneNumber }, // Search by phone number
      { otp, createdAt: Date.now() }, // Update or set the OTP and createdAt
      { upsert: true, new: true } // Upsert: Insert new if not found, return updated doc
    );
    // console.log(`Stored OTP for ${phoneNumber}`);
  } catch (error) {
    console.error("Error storing OTP:", error);
  }
}

// Validate OTP from the database
async function validateOTP(phoneNumber, otp) {
  try {
    // Find OTP for the phone number
    const otpEntry = await rememberOtpsModel.findOne({ phoneNumber });

    if (otpEntry && otpEntry.otp === otp) {
      // OTP is valid, so remove it from the database
      await rememberOtpsModel.deleteOne({ phoneNumber });
      // console.log("OTP validated");
      return true;
    } else {
      // console.log("OTP invalid or expired");
      return false;
    }
  } catch (error) {
    // console.error("Error validating OTP:", error);
    return false;
  }
}

module.exports = { storeOTP, validateOTP };

// const otps = {}; // Store OTPs temporarily in-memory

// // Store OTP with an expiry
// function storeOTP(phoneNumber, otp) {
//   const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
//   otps[phoneNumber] = { otp, expiryTime };
//   console.log(`Stored OTP for ${phoneNumber}`);

//   // Set a timeout to automatically remove OTP after expiry
//   setTimeout(() => {
//     delete otps[phoneNumber];
//     console.log(`OTP for ${phoneNumber} expired and removed`);
//   }, 5 * 60 * 1000); // 5 minutes
// }

// // Validate OTP
// function validateOTP(phoneNumber, otp) {
//   const storedData = otps[phoneNumber];
//   if (
//     storedData &&
//     Date.now() < storedData.expiryTime &&
//     storedData.otp === otp
//   ) {
//     delete otps[phoneNumber]; // OTP validated, remove it from memory
//     console.log("OTP validated");
//     return true;
//   } else {
//     console.log("OTP invalid or expired");
//     return false;
//   }
// }

// module.exports = { storeOTP, validateOTP };
