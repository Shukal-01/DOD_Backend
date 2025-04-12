const mongoose = require('mongoose');

const doctorPatientSessionSchema = mongoose.Schema({
    doctorId: { type: String },
    doctorName: { type: String },
    sessionId: { type: String },
    patientId: { type: String },
    patientName: { type: String },
    sessionMethod: { type: String },
    sessionToken: { type: String },
    // -----------------------------------
    sesstionStartTime: { type: String },
    status: { type: String },
    // -----------------------------------
    messages: { type: Array },
    // -----------------------------------
    sesstionEndTime: { type: String },
    // -----------------------------------
    sessionTotalTime: { type: String },
    sesstionTotalCost: { type: String },
    isDeductedFromPatient: { type: Boolean },
    // -----------------------------------
    prescriptionImage: { type: String },
    // -----------------------------------
    created: { type: Date },
    updated: { type: Date },
})

const doctorPatientSessionModel = mongoose.model('doctorPatientSession', doctorPatientSessionSchema);

module.exports = doctorPatientSessionModel;
