const mongoose = require("mongoose");

const doctorSingleSessionChargesSchema = mongoose.Schema(
  {
    doctorId: { type: String, required: true },
    time: { type: Number, required: true }, // in minutes
    rate: { type: Number, required: true },
    status: { type: Number, enum: [1, 0], default: 0 },
  },
  { timestamps: true }
);

const doctorSingleSessionChargesModel = mongoose.model(
  "doctor_single_session_charges",
  doctorSingleSessionChargesSchema
);

module.exports = doctorSingleSessionChargesModel;
