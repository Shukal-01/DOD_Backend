const mongoose = require("mongoose");

const organizationJobPossApplicationsSchema = mongoose.Schema(
  {
    applicantName: { type: String },
    organizationName: { type: String },
    JopPostId: { type: String, required: true },
    organizationId: { type: String, required: true },
    doctorId: { type: String, required: true },
    applicationTime: { type: Date },
    rejectReason: { type: String },
    doctorAcceptedOffer: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
    },
    joiningDate: {type: Date},
    rejectedDate: {type: Date},
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    applicationUpdateDateByOrganization : {type: Date},
  },
  { timestamps: true }
);

const organizationJobPossApplicationsModel = mongoose.model(
  "organizationjobpossapplications",
  organizationJobPossApplicationsSchema
);

module.exports = organizationJobPossApplicationsModel;
