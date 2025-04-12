const mongoose = require("mongoose");

const organizationJoinedDoctorsSchama = mongoose.Schema({
  doctorId: { type: String },
  organizationId: { type: String },
  doctorName: { type: String },
  jobPostId: {type:String},
  organizationName: { type: String },
  organizationLogo: { type: String },
  //   ---------
  jobDesignation: { type: String },
  salaryOfDoctor: { type: Number },
  // --
  chatRate: { type: Number, default: 10 },
  videoCallRate: { type: Number, default: 15 },
  callRate: { type: Number, default: 20 },
  // --
  jobStartTime: { type: String },
  jobEndTime: { type: String },
  workingDays: { type: [String],default: [] },
  //   ---------
  // --
  offerAcceptDate: { type: Date },
  // --
  workingStatus: {
    type: String,
    enum: ["working", "inactive", "blocked", "left", "removed"],
  }, // left - by doctor , removed - by organization
  leaveOrRemovedDate: { type: Date },
  leaveOrRemovedReason: { type: String },
  // --
});

const organizationJoinedDoctorsModel = mongoose.model(
  "organizationjoineddoctors",
  organizationJoinedDoctorsSchama
);

module.exports = organizationJoinedDoctorsModel;
