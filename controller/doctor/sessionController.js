const handleCreate = require('../../helper/crudHelpers/handleCreate');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const { getTimeDifference } = require('../../helper/date&TimeFunctions/date_Time_functions');
const doctorPatientSessionModel = require('../../model/doctorPatientSession.model');
const doctorModel = require('../../model/doctors.model');
const patientModel = require('../../model/patients.model');
const handleUpdate = require('../../helper/crudHelpers/Update');


const createSession = async (req, res) => {
    // =============================================================================
    // =============================================================================
    // =============================================================================
    // Get the value of the environment variable AGORA_APP_ID. Make sure you set this variable to the value you obtained from Agora console
    const appId = process.env.AGORA_APP_ID;
    // Get the value of the environment variable AGORA_APP_CERTIFICATE. Make sure you set this variable to the App certificate you obtained from Agora console
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    // Replace channelName with the name of the channel you want to join
    const channelName = 'channel' + req.user.userData._id;
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

    // =============================================================================
    // =============================================================================
    // =============================================================================
    // const dateTimeString = getDateTimeInStringFormat();
    handleCreate(req, res, doctorPatientSessionModel, [], {
        // sesstionStartTime: dateTimeString,
        sessionToken: chanelToken,
        status: 'ongoing'
    }, '')
}

const previous_messages = async (req, res) => {
    const prevMessages = await doctorPatientSessionModel.findOne({ _id: req.body.session_id })
    if (prevMessages && prevMessages.messages.length > 0) {
        return res.status(200).json({ message: 'success', data: prevMessages.messages.reverse() });
    }
    return res.status(200).json({ message: 'success', data: [] });
}

const add_message = async (req, res) => {
    try {

        if (!req.body.sessionId) {
            return res.status(200).json({ message: 'error', detail: 'Session Not Found' })
        }
        const newMessage = JSON.parse(req.body.messageObj)
        const prevMessage = await doctorPatientSessionModel.findOne({ _id: req.body.sessionId })

        const newMessageArray = prevMessage.messages
        newMessageArray.push(newMessage)

        prevMessage.messages = newMessageArray;

        if (prevMessage.save()) {
            return res.status(200).json({ message: 'success' });
        } else {
            return res.status(200).json({ message: 'error' });
        }
    } catch (error) {
        return res.status(200).json({ message: 'error' });
    }
}


const close_session = async (req, res) => {

    try {


        const sessionEndTime = req.body.sesstionEndTime;
        const sessionData = await doctorPatientSessionModel.findOne({ _id: req.body.session_id })
        if (sessionData.status === 'completed') {
            return res.status(200).json({ message: 'error', detail: 'Session Already Marked Completed.' })
        }
        // chatRate
        // videoCallRate
        // callRate
        const sessionMethod = sessionData.sessionMethod;
        const doctorData = await doctorModel.findOne({ _id: sessionData.doctorId })

        let doctorRate = null;
        if (sessionMethod == 'chat') {
            doctorRate = doctorData.chatRate
        } else if (sessionMethod == 'videoCall') {
            doctorRate = doctorData.videoCallRate
        } else if (sessionMethod == 'call') {
            doctorRate = doctorData.callRate
        }

        if (!doctorRate) {
            // return res.status(200).json({ message: 'error', detail: 'Doctor Session Rate Not Defined' })
            return res.status(200).json({ message: 'success' });
        }
        const doctorRatePerSecont = doctorRate / 60;

        const timeDifference = getTimeDifference(sessionData.sesstionStartTime, sessionEndTime)

        const totalTimeInSecond = (timeDifference.minutes * 60) + timeDifference.seconds;

        // --------------------------------------------------------------- 
        const sessionTotalTime = totalTimeInSecond;
        const sesstionTotalCost = totalTimeInSecond * doctorRatePerSecont;
        // ---------------------------------------------------------------
        // ============ Deduct Amount from patient Account ============
        let isDeductedFromPatient = false;
        // ----> 

        const patientData = await patientModel.findOne({ _id: sessionData.patientId });
        const prevPatientWalletAmount = patientData.WalletAmount ? patientData.WalletAmount : 0;
        const amountAfterDuduction = prevPatientWalletAmount - sesstionTotalCost

        patientData.WalletAmount = amountAfterDuduction;
        if (!patientData.save()) {
            sessionData.sessionTotalTime = sessionTotalTime;
            sessionData.sesstionTotalCost = sesstionTotalCost;
            sessionData.isDeductedFromPatient = isDeductedFromPatient;
            sessionData.status = 'completed';
            sessionData.save()
            return res.status(200).json({ message: 'Success' })

        } else {
            isDeductedFromPatient = true;
        }

        // ----------- update doctor balance --------------------
        let doctorPrevBalance = doctorData.currentBalance ? doctorData.currentBalance : 0;

        const newBalance = doctorPrevBalance + sesstionTotalCost;

        doctorData.currentBalance = newBalance;
        if (!doctorData.save()) {
            return res.status(200).json({ message: 'error', detil: 'Server error' });
        } else {
            sessionData.sessionTotalTime = sessionTotalTime;
            sessionData.sesstionTotalCost = sesstionTotalCost;
            sessionData.isDeductedFromPatient = isDeductedFromPatient;
            sessionData.status = 'completed';

            sessionData.save()
            return res.status(200).json({ message: 'success' });


        }
    } catch (error) {
        return res.status(200).json({ message: 'error' });
    }
}

const addprescriptionimage = async (req, res) => {

    const sessionId = req.body.sessionId;

    handleUpdate(req, res, doctorPatientSessionModel, ['sessionId'], {}, "", { _id: sessionId });

    // console.log(req.files);

    // return res.status(200).json({ message: 'success' });
}


const sessionHistory = async (req, res) => {
    try {
        const doctorId = req.user.userData._id;
        const allSessions = await doctorPatientSessionModel.find({ doctorId: doctorId })
        if (!allSessions) {
            throw new Error();
        }
        return res.status(200).json({ message: 'success', data: allSessions.reverse() });
    } catch (error) {
        return res.status(200).json({ message: 'error', data: [], detail: 'Error! Please try after sometime!' });

    }
}


module.exports = { createSession, previous_messages, add_message, close_session, addprescriptionimage, sessionHistory }