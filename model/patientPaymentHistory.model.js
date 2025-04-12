const mongoose = require("mongoose");

const patientPaymentHistorySchema = mongoose.Schema({
  patientId: { type: String },
  paymentId: { type: String },
  amount: { type: Number, require: true }, // this is in paise format
  rzpOrderId: { type: String, required: true },
  mobileNumber: { type: String },
  dateTime: { type: String },
  status: { type: String },// failed / success / pending
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const patientPaymentHistoryModel = mongoose.model(
  "patient_payment_histories",
  patientPaymentHistorySchema
);

module.exports = patientPaymentHistoryModel;
