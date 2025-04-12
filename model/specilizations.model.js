const mongoose = require("mongoose");

const specilizationSchema = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true, trim: true },
    icon: { type: String, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["0", "1"], default: "0" },
    departmentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const specializationModel = mongoose.model(
  "specilizations",
  specilizationSchema
);

module.exports = specializationModel;
