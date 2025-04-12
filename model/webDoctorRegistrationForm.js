const mongoose = require("mongoose");

const webDoctorRegistrationFormSchema = new mongoose.Schema({
  // Basic Information
  fullName: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dateOfBirth: { type: Date },
  profilePicture: { type: String }, // URL or file path

  // Contact Information
  emailAddress: { type: String },
  phoneNumber: { type: String },
  officeAddress: { type: String },
  consultationHours: { type: String },
  emergencyContactInformation: { type: String },

  // Professional Details
  medicalLicenseNumber: { type: String },
  specializations: { type: [String] },
  yearsOfExperience: { type: Number },
  currentWorkplace: { type: String },
  consultationFees: { type: Number },
  availability: { type: String },
  telemedicineAvailability: { type: String },

  // Education and Training
  medicalSchool: { type: String },
  graduationYear: { type: Number },
  postgraduateTraining: { type: String },
  boardCertifications: { type: [String] },
  additionalCoursesAndCertifications: { type: [String] },

  // Work Experience
  previousWorkplaces: { type: [String] },
  yearsOfPracticeInEachWorkplace: { type: [String] },
  positionsHeld: { type: [String] },

  // Skills and Expertise
  areasOfExpertise: { type: [String] },
  proceduresPerformed: { type: [String] },
  languagesSpoken: { type: [String] },

  // Professional Memberships
  professionalMemberships: { type: [String] },

  // Awards and Recognitions
  awardsAndHonorsReceived: { type: [String] },

  // Publications and Research
  researchPapersPublished: { type: [String] },
  booksOrChaptersWritten: { type: [String] },
  conferencePresentations: { type: [String] },

  // Personal Statement or Bio
  shortBioOrPersonalStatement: { type: String },
  philosophyOfCare: { type: String },

  // Reviews and Ratings
  patientReviewsAndRatings: { type: String },

  // Social Media and Online Presence (Optional)
  linkedInProfile: { type: String },
  professionalWebsiteOrBlog: { type: String },
  socialMediaHandles: { type: [String] },

  // Compliance and Legal Information
  insuranceAccepted: { type: [String] },
  //   ------------ status --------------
  status: { type: String },
});

const webDoctorRegistrationFormModel = mongoose.model(
  "webDoctorRegistrationForm",
  webDoctorRegistrationFormSchema
);

module.exports = webDoctorRegistrationFormModel;
