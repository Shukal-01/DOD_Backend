const mongoose = require("mongoose");

const doctorRegistrationSchema = mongoose.Schema(
  {
    name: { type: String },
    mobileNumber: { type: Number },
    patientId: {type: String,required : true}, 
    department: { type: String },
    specialization: { type: String },
    professionalEmailAddress: { type: String },
    experience: { type: String },
    education: { type: String },
    workAddress: { type: String },
    workPlaceName: { type: String },
    certificate: { type: String },
    status: { type: String }, // pending , rejected, accepted
    created: { type: Date },
    // -----------------------------------------
    experienceDescription: { type: String },
    aboutDescription: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    languagesSpoken: { type: String },
    // -----------------------------------------
  },
  { timestamps: true }
);

const doctorRegistrationModel = mongoose.model(
  "doctorRegistration",
  doctorRegistrationSchema
);

module.exports = doctorRegistrationModel;
