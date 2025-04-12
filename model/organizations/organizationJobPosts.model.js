const mongoose = require("mongoose");

// Counter Schema for auto-incrementing jobPostNumber
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1111111110 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Job Post Schema
const organizationJobPostSchema = mongoose.Schema(
  {
    jobPostNumber: {
      type: Number,
      unique: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
    organizationName: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    minSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    maxSalary: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value >= this.minSalary;
        },
        message: "Max salary must be greater than or equal to min salary",
      },
    },
    jobStartTime: {
      type: String,
    },
    jobEndTime: {
      type: String,
    },
    jobWorkingDay: {
      type: [String],
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["0", "1"],
      default: "0",
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-increment jobPostNumber
organizationJobPostSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "jobPostNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.jobPostNumber = counter.seq;
  }
  next();
});

const organizationJobPostModel = mongoose.model(
  "OrganizationJobPost",
  organizationJobPostSchema
);

module.exports = organizationJobPostModel;
