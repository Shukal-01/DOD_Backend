const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema({
    name: { type: String },
    phone: { type: String },
    department: { type: String },
    medicalRecord: { type: String },
    date: { type: String },
    time: { type: String },
    reason: { type: String },
    status: { type: String },
    created: { type: Date },
})

const contactRequestModel = mongoose.model('contactRequest', contactRequestSchema);

module.exports = contactRequestModel;