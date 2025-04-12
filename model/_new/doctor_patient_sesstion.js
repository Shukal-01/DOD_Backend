const mongoose = require("mongoose");

const doctorPatientSessionSchema = mongoose.Schema(
  {
    patientReason: { type: String, required: true },
    patientId: {
      type: String,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: String,
      ref: "Doctor",
      required: true,
    },
    initialConnectionMethod: {
      type: String,
      enum: ["chat", "video", "call"],
      required: true,
    },
    dyteDetails: {
      meetingId: { type: String },
      doctorJoinToken: { type: String },
      patientJoinToken: { type: String },
    },
    chatTime: { type: Number, default: 0 },
    videoTime: { type: Number, default: 0 },
    callTime: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "pending", // new request
        "accepted", // doctor accepted -> patient in waiting room waiting for doctor to connect
        "ongoing", // ongoing session [ any -> chat video or call]
        // ----------------
        "completed", // succefully competed
        "rejected", // doctor rejected
        "doctor_cancelled", // after accepting doctor cancelled
        "cancelled", // patient cancelled
        // ----------------
      ],
      default: "pending",
    },
    isDoctorJoined: { type: Number, default: 0 },
    doctorJoiningTime: {
      type: Date,
      default: null,
    },
    isPatientJoined: { type: Number, default: 0 },
    patientJoiningTime: {
      type: Date,
      default: null,
    },
    sessionMessages: [
      {
        userId: { type: String },
        Message: { type: String },
        dateTime: { type: Date, default: Date.now },
      },
    ],
    sessionPrescriptions: {
      type: [
        [
          {
            medicineName: { type: String },
            meal: { type: String },
            timing: { type: String },
            days: { type: String },
          },
        ],
      ],
    },

    // ----------- important for whome account will be used for transaction
    _targetChatCallVideoCallAndOtherAmounts: {
      chatRate: { type: Number, required: true },
      videoCallRate: { type: Number, required: true },
      audioCallRate: { type: Number, required: true },
      singleChargeSession: {
        time: { type: Number },
        rate: { type: Number },
      },
      // add other chages accordingly as needed
    },
    _targetDoctorOrOrganization: {
      type: String,
      enum: ["doctor", "organization"],
      required: true,
    },
    // --- session transaction account - doctor or organization
    _targetId: { type: String, required: true },
    // -- after session is completed update below 2 fields
    _targetFees: { type: Number },
    _feesTransactionStatus: {
      type: String,
      enum: ["empty", "pending", "completed"],
      default: "empty",
    },
    _sessionType: {
      type: String,
      enum: ["per_minute", "single_session", "multi_session"],
    }, // default null [ note: null || per_minute = per minute ]
    _feesAmount: {
      type: Number,
      default: 0,
    },
    // time will be calculated from [ pateint_joined  - session_end  ] time
    // ----------- important for whome account will be used for transaction
    compeleteMarkedBy: { type: String, enum: ["patient", "doctor"] },
    fulfilled: { type: Number, enum: [0, 1], default: 0 }, // only on patients interaction
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    sessionDuration: { type: Number, default: 0 }, // in seconds
    notes: { type: String },
    _patientAvailableSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Add a new prescription list (array of prescriptions) to the sessionPrescriptions array
doctorPatientSessionSchema.methods.addPrescriptionList = function (
  newPrescriptionList
) {
  this.sessionPrescriptions.push(newPrescriptionList);
  return this.save();
};

// Remove a prescription list by its index
doctorPatientSessionSchema.methods.removePrescriptionList = function (index) {
  if (index >= 0 && index < this.sessionPrescriptions.length) {
    this.sessionPrescriptions.splice(index, 1);
    return this.save();
  } else {
    throw new Error("Invalid index");
  }
};

const doctorPatientSessionModel = mongoose.model(
  "doctor_patient_sessions",
  doctorPatientSessionSchema
);

module.exports = doctorPatientSessionModel;
