const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  patientMobileNumber: { type: Number, required: true, unique: true },
  // ============================
  name: { type: String },
  image: { type: String },
  bannerImage: { type: String },
  professionalNumber: { type: Number, unique: true },
  department: { type: String },
  professionalEmailAddress: { type: String, unique: true },
  specialization: { type: String }, // backend se ana chahiye
  workingOrganizations: { type: Array },
  approvedWorkingOrganizations: { type: Array },
  workingOrganizationsIsUpdated: { type: String }, //verified | pending  | rejected
  experience: { type: String },
  education: { type: String },
  workAddress: { type: String },
  workPlaceName: { type: String },
  certificate: { type: String },
  // ---------------------------------------
  chatRate: { type: Number, default: 10 },
  videoCallRate: { type: Number, default: 15 },
  callRate: { type: Number, default: 20 },
  // ---------------------------------------
  // --------------- new
  // ---------------------------------------
  // ---------------------------------------
  isOnline: { type: Number, enum: [1, 0] },
  chat: { type: Number, enum: [1, 0] },
  video: { type: Number, enum: [1, 0] },
  call: { type: Number, enum: [1, 0] },
  // ---------------------------------------
  currentOnlineFor: {
    doctorOrOrganization: { type: String, enum: ["doctor", "organization"] },
    idOf: { type: String },
    chatRate: { type: Number },
    videoCallRate: { type: Number },
    audioCallRate: { type: Number },
    _date: { type: String },
    comeOnlineAt: { type: Date },
    goneOfflineAt: { type: Date },
    tatalDuration: { type: Number }, // in seconds
    allSessionsId: { type: [String] },
  },
  // ---------------------------------------
  isLive: { type: Number },
  liveStartedTime: { type: String },
  currentLiveStreamid: { type: String },
  // ---------------------------------------
  experienceDescription: { type: String },
  aboutDescription: { type: String },
  // ---------------------------------------
  currentBalance: { type: Number, default: 0 },
  // ---------------------------------------
  created: { type: Date, default: Date.now },
  // ---------------------------------------
  city: { type: String },
  state: { type: String },
  country: { type: String },
  // ---------------------------------------
  // ---------------------------------------
  gender: { type: String },
  dateOfBirth: { type: String },
  profilePicture: { type: String },
  consultationHours: { type: String },
  emergencyContactInformation: { type: String },
  medicalLicenseNumber: { type: String },
  consultationFees: { type: String },
  availability: { type: String },
  telemedicineAvailability: { type: String },
  medicalSchool: { type: String },
  graduationYear: { type: String },
  postgraduateTraining: { type: String },
  boardCertifications: { type: String },
  additionalCoursesAndCertifications: { type: String },
  previousWorkplaces: { type: String },
  yearsOfPracticeInEachWorkplace: { type: String },
  positionsHeld: { type: String },
  areasOfExpertise: { type: String },
  proceduresPerformed: { type: String },
  languagesSpoken: { type: [String] },
  professionalMemberships: { type: String },
  awardsAndHonorsReceived: { type: String },
  researchPapersPublished: { type: String },
  booksOrChaptersWritten: { type: String },
  conferencePresentations: { type: String },
  shortBioOrPersonalStatement: { type: String },
  philosophyOfCare: { type: String },
  // --------------------------------------------
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  // --------------------------------------------
  linkedInProfile: { type: String },
  professionalWebsiteOrBlog: { type: String },
  socialMediaHandles: { type: String },
  insuranceAccepted: { type: String },
  // ---------------------------------------
  // ---------------------------------------
  // ---------------------------------------
  // ---------------------------------------
  workStartTiming: { type: String },
  workEndTiming: { type: String },
  workDays: { type: Array },
  // --------------------------------------- bank details
  payment_bankName: { type: String },
  payment_accountHolderName: { type: String },
  payment_accountNumber: { type: String },
  payment_ifscCode: { type: String },
  // ---------------------------------------
  deviceId: { type: String },
  // ---------------------------------------
  status: { type: String, default: "verified" }, //verified |    blocked
});

doctorSchema.index({ name: "text" });

const doctorModel = mongoose.model("doctors", doctorSchema);

module.exports = doctorModel;
