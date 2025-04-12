const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const handleUpdateNew2 = require("../../helper/crudHelpers/new/UpdateNew2");
const doctorProfileGalleriesModel = require("../../model/doctor/doctorProfileGalleryModel");
const doctorReviewModel = require("../../model/doctor/doctorReviews.model");
const doctorModel = require("../../model/doctors.model");
const patientModel = require("../../model/patients.model");
const { sendError, sendSuccess } = require("../_utils/req_res_messages");

// const  = async (req, res) => {
//   try {
//     console.log("====================================");
//     console.log(req.body);
//     console.log("====================================");
//     handleCreate(req, res, doctorReviewModel, [], {}, "");
//   } catch (error) {
//     return res.status(404).json({ message: "error" });
//   }
// };

const addNewRating = async (req, res) => {
  try {
    const { doctorId, RatingValue } = req.body;

    // Validate rating value
    const ratingValueInt = parseFloat(RatingValue, 10);
    if (isNaN(ratingValueInt) || ratingValueInt < 0) {
      return sendError(res, 200, "Invalid rating value");
    }

    // Update doctor's rating
    const updatedDoctor = await doctorModel.findOneAndUpdate(
      { _id: doctorId },
      {
        $inc: {
          rating: ratingValueInt, // Increment rating
          ratingCount: 1, // Increment rating count
        },
      },
      { new: true } // Return updated document
    );

    // If doctor not found
    if (!updatedDoctor) {
      return sendError(res, 200, "Doctor not found");
    }

    const successCallback = async (givenAddedRating) => {
      const patientId = req.user.userData._id;
      const patientData = await patientModel.findOne({ _id: patientId });

      let newArr = patientData?.ratedDoctorArr ?? [];
      newArr.push(doctorId);

      // Update patient's rated doctors
      const isPatientUpdated = await handleUpdateNew2(
        req,
        patientModel,
        [
          "doctorId",
          "RatingValue",
          "RatingReview",
          "patientId",
          "patientName",
          "patientImage",
          "patientCity",
          "date",
        ],
        { ratedDoctorArr: newArr },
        "",
        { _id: patientId }
      );

      if (isPatientUpdated?.message === "success") {
        return sendSuccess(res, 200, {
          updatedDoctor,
          givenAddedRating,
          ratedDoctorArr: isPatientUpdated.ratedDoctorArr,
        });
      } else {
        // console.log(isPatientUpdated?.error);

        return sendError(
          res,
          200,
          isPatientUpdated?.error || "Something went wrong!"
        );
      }
    };

    // Create review after rating update
    handleCreate(
      req,
      res,
      doctorReviewModel,
      [],
      {},
      "",
      null,
      successCallback
    );
  } catch (error) {
    console.error("Error in addNewRating:", error);
    return res.status(200).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

const getAllRatings = async (req, res) => {
  try {
    // console.log("get all ratings");

    // console.log(req.body.doctorId);

    handleGetWithMsg(
      req,
      res,
      doctorReviewModel,
      {
        doctorId: req.params.doctorId
      },
      true
    );
  } catch (error) {
    // console.log(error);

    return res.status(400).json({ message: "error", data: [] });
  }
};

const getAllGalleryImages = async (req, res) => {
  try {
    const doctorId = req.params._id;
    handleGetWithMsg(req, res, doctorProfileGalleriesModel, {
      doctorId: doctorId,
    });
  } catch (error) {
    // console.log(error);

    return res.status(200).json({ message: "error", data: [] });
  }
};

module.exports = { addNewRating, getAllRatings, getAllGalleryImages };
