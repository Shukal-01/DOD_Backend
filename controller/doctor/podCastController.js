const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const doctorPodcastSessionModel = require('../../model/doctorPodcastSession');
const doctorModel = require('../../model/doctors.model');


const startPodCast = async (req, res) => {
    const doctorId = req.user.userData._id;

    const doctorData = await doctorModel.findById(doctorId);

    if (!doctorData) {
        return res.status(200).json({ message: 'error', detail: "doctor not found!" })
    }





    const createNewPodcastSession = await doctorPodcastSessionModel.create({
        doctorId: doctorData._id,
        doctorName: doctorData.name,
        sesstionStartTime: req.body.currentTime,
        status: 'ongoing',
    })

    if (!createNewPodcastSession) {
        return res.status(200).json({ message: 'error', detail: "error creating new podcast session." })
    }

    // =============================================================================
    // =============================================================================
    // =============================================================================
    // Get the value of the environment variable AGORA_APP_ID. Make sure you set this variable to the value you obtained from Agora console
    const appId = process.env.AGORA_APP_ID;
    // Get the value of the environment variable AGORA_APP_CERTIFICATE. Make sure you set this variable to the App certificate you obtained from Agora console
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    // Replace channelName with the name of the channel you want to join
    const channelName = 'channel' + createNewPodcastSession._id;
    // Fill in your actual user ID
    const uid = 0;
    // Token validity time in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpirationInSecond = Number.parseInt(currentTime + 36000);
    // const chanelToken = RtcTokenBuilder.buildTokenWithUidAndPrivilege(
    //     appId,
    //     appCertificate,
    //     channelName,
    //     uid,
    //     tokenExpirationInSecond,
    //     joinChannelPrivilegeExpireInSeconds,
    //     pubAudioPrivilegeExpireInSeconds,
    //     pubVideoPrivilegeExpireInSeconds,
    //     pubDataStreamPrivilegeExpireInSeconds
    // );
    const chanelToken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, RtcRole.PUBLISHER, tokenExpirationInSecond)
    const viewerToken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, RtcRole.SUBSCRIBER, tokenExpirationInSecond)

    // =============================================================================
    // =============================================================================
    // =============================================================================

    const updateDoctorData = await doctorModel.findOneAndUpdate({ _id: doctorData._id }, {
        isLive: 1,
        liveStartedTime: createNewPodcastSession.sesstionStartTime,
        currentLiveStreamid: createNewPodcastSession._id,
    })

    if (!updateDoctorData) {
        return res.status(200).json({ message: 'error', detail: 'session not stored' });
    }

    const updateSession = await doctorPodcastSessionModel.findOneAndUpdate({ _id: createNewPodcastSession._id }, {
        sessionToken: chanelToken,
        viewerToken: viewerToken,
    })

    if (!updateSession) {
        return res.status(200).json({ message: 'error', detail: 'session not stored' });
    }

    return res.status(200).json({ message: 'success', data: { token: chanelToken, chanelName: createNewPodcastSession._id } });
}


const stopPodCast = async (req, res) => {
    const doctorId = req.user.userData._id;

    const doctorData = await doctorModel.findById(doctorId);

    if (!doctorData) {
        return res.status(200).json({ message: 'error', detail: "doctor not found!" })
    }

    if (!doctorData.isLive || doctorData.isLive !== 1) {
        return res.status(200).json({ message: 'error', detail: "No Podcast Running!" })
    }

    const podcastSessionData = await doctorPodcastSessionModel.findOneAndUpdate({ _id: doctorData.currentLiveStreamid }, {
        sesstionEndTime: req.body.currentTime,
        status: 'closed',
    })


    if (!podcastSessionData) {
        return res.status(200).json({ message: 'error', detail: "Podcast Not Updated!" })
    }

    const updateDoctor = await doctorModel.findOneAndUpdate({ _id: doctorId }, {
        isLive: 0,
        liveStartedTime: '',
        currentLiveStreamid: '',
    });

    if (!updateDoctor) {
        return res.status(200).json({ message: 'error', detail: "Status Not Updated!" })
    }

    return res.status(200).json({ message: 'success' })


}

module.exports = { startPodCast, stopPodCast }







