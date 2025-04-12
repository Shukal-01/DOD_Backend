const mongoose = require("mongoose");

const patientSchema = mongoose.Schema(
  {
    image: { type: String },
    mobileNumber: { type: Number, unique: true },
    email: { type: String },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    relativeName: { type: String },
    bloodGroup: { type: String },
    gender: { type: String },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    address: { type: String },
    created: { type: Date },
    updated: { type: Date },
    // -----------------------------------------
    city: { type: String },
    state: { type: String },
    country: { type: String },
    // ---------------------------------------
    likedDoctorArr: { type: [String], default: [] },
    ratedDoctorArr: { type: [String], default: [] },
    // -----------------------------------------
    chronicDisease: { type: Object },
    allergy: { type: Object },
    currentMedicine: { type: Object },
    // -----------------------------------------
    status: { type: String },
    WalletAmount: { type: Number, default: 0 },
    // ----------------------------------------
    doctorVerificationStatus: { type: String },
    doctorId: { type: String },
    // ----------------------------------------
    helpfulCountDoctors: { type: [String], default: [] },
    // ----------------------------------------
    deviceId: { type: String },
    // ----------------------------------------
  },
  { timestamps: true }
);

const patientModel = mongoose.model("patients", patientSchema);

module.exports = patientModel;
