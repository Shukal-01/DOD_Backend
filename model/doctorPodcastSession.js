const mongoose = require('mongoose');

const doctorPodcastSessionSchema = mongoose.Schema({
    doctorId: { type: String },
    doctorName: { type: String },
    sessionChanelName: { type: String },
    sessionToken: { type: String },
    viewerToken: { type: String },
    sesstionStartTime: { type: String },
    status: { type: String },
    // -----------------------------------
    // -----------------------------------
    sessionId: { type: String },
    // -----------------------------------
    messages: { type: Array },
    // -----------------------------------
    sesstionEndTime: { type: String },
    // -----------------------------------
    created: { type: Date },
    updated: { type: Date },
})

const doctorPodcastSessionModel = mongoose.model('doctorPodcastSession', doctorPodcastSessionSchema);

module.exports = doctorPodcastSessionModel;


