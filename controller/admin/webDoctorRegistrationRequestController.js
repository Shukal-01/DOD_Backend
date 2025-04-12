const webDoctorRegistrationFormModel = require("../../model/webDoctorRegistrationForm");

const doctorModel = require("../../model/doctors.model");
const patientModel = require("../../model/patients.model");

// ----------------------------------------------------------------
// crud handlers
const handleDelete = require("../../helper/crudHelpers/Delete");
const handleUpdate = require("../../helper/crudHelpers/Update");
// ----------------------------------------------------------------

const get = async (req, res) => {
  let data = await webDoctorRegistrationFormModel.find({
    $or: [
      { status: "pending" },
      { status: null },
      { status: undefined },
      { status: "" },
    ],
  });
  return res.status(200).json({ message: "success", data: data });
};

const deleteData = async (req, res) => {
  handleDelete(req, res, webDoctorRegistrationFormModel, {
    _id: req.params.itemId,
  });
};
const updateDate = async (req, res) => {
  try {
    const givenStatus = req.body.status;

    if (!givenStatus) {
      return res
        .status(200)
        .json({ message: "error", detail: "invalid status" });
    }

    if (givenStatus === "reject") {
      handleUpdate(req, res, webDoctorRegistrationFormModel, [], {}, "", {
        _id: req.params.itemId,
      });
    } else if (givenStatus === "verified") {
      let doctorRequestData = await webDoctorRegistrationFormModel.findOne({
        _id: req.params.itemId,
      });
      const newDoctorObj = {
        name: doctorRequestData.fullName,
        professionalNumber: doctorRequestData.phoneNumber,
        department: doctorRequestData.specializations?.[0],
        professionalEmailAddress: doctorRequestData.emailAddress,
        specialization: doctorRequestData.specializations?.[0],
        experience: doctorRequestData.yearsOfExperience,
        education: "",
        workingStatus: doctorRequestData.currentWorkplace ? "yes" : "no",
        workAddress: doctorRequestData.officeAddress,
        workPlaceName: doctorRequestData.currentWorkplace,
        isOnline: 0,
        chatStatus: 0,
        videoCallStatus: 0,
        callStatus: 0,
        isLive: 0,
        status: "active",
        // ====================================================
        gender: doctorRequestData.gender,
        dateOfBirth: doctorRequestData.dateOfBirth,
        profilePicture: doctorRequestData.profilePicture,
        consultationHours: doctorRequestData.consultationHours,
        emergencyContactInformation:
          doctorRequestData.emergencyContactInformation,
        medicalLicenseNumber: doctorRequestData.medicalLicenseNumber,
        consultationFees: doctorRequestData.consultationFees,
        availability: doctorRequestData.availability,
        telemedicineAvailability: doctorRequestData.telemedicineAvailability,
        medicalSchool: doctorRequestData.medicalSchool,
        graduationYear: doctorRequestData.graduationYear,
        postgraduateTraining: doctorRequestData.postgraduateTraining,
        boardCertifications: doctorRequestData.boardCertifications?.[0],
        additionalCoursesAndCertifications:
          doctorRequestData.additionalCoursesAndCertifications?.[0],
        previousWorkplaces: doctorRequestData.previousWorkplaces?.[0],
        yearsOfPracticeInEachWorkplace:
          doctorRequestData.yearsOfPracticeInEachWorkplace?.[0],
        positionsHeld: doctorRequestData.positionsHeld?.[0],
        areasOfExpertise: doctorRequestData.areasOfExpertise?.[0],
        proceduresPerformed: doctorRequestData.proceduresPerformed?.[0],
        languagesSpoken: doctorRequestData.languagesSpoken?.[0],
        professionalMemberships: doctorRequestData.professionalMemberships?.[0],
        awardsAndHonorsReceived: doctorRequestData.awardsAndHonorsReceived?.[0],
        researchPapersPublished: doctorRequestData.researchPapersPublished?.[0],
        booksOrChaptersWritten: doctorRequestData.booksOrChaptersWritten?.[0],
        conferencePresentations: doctorRequestData.conferencePresentations?.[0],
        shortBioOrPersonalStatement:
          doctorRequestData.shortBioOrPersonalStatement,
        philosophyOfCare: doctorRequestData.philosophyOfCare,
        patientReviewsAndRatings: doctorRequestData.patientReviewsAndRatings,
        linkedInProfile: doctorRequestData.linkedInProfile,
        professionalWebsiteOrBlog: doctorRequestData.professionalWebsiteOrBlog,
        socialMediaHandles: doctorRequestData.socialMediaHandles?.[0],
        insuranceAccepted: doctorRequestData.insuranceAccepted?.[0],
      };

      let createNewDoctor = await doctorModel.create(newDoctorObj);
      if (!createNewDoctor) {
        console.log("====================================");
        console.log("err 3");
        console.log("====================================");
        return res
          .status(200)
          .json({ message: "error", detail: "doctor not created" });
      }

      const isPatientDoctorStatusUpdated = await patientModel.findOneAndUpdate(
        {
          mobileNumber: doctorRequestData.phoneNumber,
        },
        {
          doctorVerificationStatus: "verified",
          doctorId: createNewDoctor._id,
        }
      );

      if (!isPatientDoctorStatusUpdated) {
        await patientModel.create({
          mobileNumber: doctorRequestData.phoneNumber,
          doctorVerificationStatus: "verified",
          doctorId: createNewDoctor._id,
        });
      }

      const deleteRequest = await webDoctorRegistrationFormModel.deleteOne({
        _id: req.params.itemId,
      });

      if (!deleteRequest) {
        console.log("====================================");
        console.log("err 1");
        console.log("====================================");
        return res
          .status(200)
          .json({ message: "error", detail: "request not deleted" });
      }

      return res.status(200).json({ message: "success", data: "" });
    }
  } catch (error) {
    console.log("====================================");
    console.log(error.message);
    console.log("====================================");
    return res.status(200).json({ message: "error" });
  }
};

module.exports = { get, deleteData, updateDate };
