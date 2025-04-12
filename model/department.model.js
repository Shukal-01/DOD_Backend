const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["0", "1"], default: "0" },
    departmentId: { type: String, unique: true, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const departmentModel = mongoose.model("department", departmentSchema);

module.exports = departmentModel;
