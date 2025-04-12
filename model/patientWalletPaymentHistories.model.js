const mongoose = require("mongoose");

const patientWalletPaymentHistoriesSchema = mongoose.Schema({
  patientId: { type: String },
  paymentId: { type: String },
  amount: { type: String },
  mobileNumber: { type: String },
  dateTime: { type: String }, // frontend Time
  status: { type: String }, // pending / success / failed / unsaved
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const patientWalletPaymentHistoriesModel = mongoose.model(
  "patientwalletpaymenthistories",
  patientWalletPaymentHistoriesSchema
);

module.exports = patientWalletPaymentHistoriesModel;
