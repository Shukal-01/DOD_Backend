const mongoose = require("mongoose");

const callHistorySchema = mongoose.Schema({
  serviceProviderId: { type: String },
  patientId: { type: String },
  // ----------------------------------------------------------------
  patientName: { type: String },
  patientImage: { type: String },
  patientPhone: { type: String },
  patientCity: { type: String },
  patientState: { type: String },
  patientCountry: { type: String },
  // ----------------------------------------------------------------
  dateTime: { type: String },
  status: { type: String, default: "pending" }, // enum : ['pending','viewed']
});

const callHistoryModel = mongoose.model("callhistories", callHistorySchema);

module.exports = callHistoryModel;
