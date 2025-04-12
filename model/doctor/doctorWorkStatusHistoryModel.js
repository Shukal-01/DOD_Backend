const mongoose = require("mongoose");

const doctorWorkStatusHistorySchema = mongoose.Schema(
  {
    doctorId: { type: String },
    doctorOrOrganization: { type: String, enum: ["doctor", "organization"] },
    idOf: { type: String },
    chatRate: { type: Number },
    videoCallRate: { type: Number },
    audioCallRate: { type: Number },
    comeOnlineAt: { type: String },
    goneOfflineAt: { type: String },
    tatalDuration: { type: String },
    allSessionsId: { type: [String] },
    _date: { type: String },
  },
  {
    timestamps: true,
  }
);

const doctorWorkStatusHistoryModel = mongoose.model(
  "doctorWorkStatusHistorys",
  doctorWorkStatusHistorySchema
);

module.exports = doctorWorkStatusHistoryModel;
