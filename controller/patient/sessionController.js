const { getTimeDifference } = require('../../helper/date&TimeFunctions/date_Time_functions');
const doctorPatientSessionModel = require('../../model/doctorPatientSession.model');
const doctorModel = require('../../model/doctors.model');
const patientModel = require('../../model/patients.model');




const previous_messages = async (req, res) => {
    const prevMessages = await doctorPatientSessionModel.findOne({ _id: req.body.session_id })
    if (prevMessages && prevMessages.messages.length > 0) {
        return res.status(200).json({ message: 'success', data: prevMessages.messages.reverse() });
    }
    return res.status(200).json({ message: 'success', data: [] });

}

const add_message = async (req, res) => {
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

}



const close_session = async (req, res) => {
    try {


        const sessionEndTime = req.body.sesstionEndTime;
        const sessionData = await doctorPatientSessionModel.findOne({ _id: req.body.session_id })
        if (sessionData.status === 'completed') {
            return res.status(200).json({ message: 'success', detail: 'Session Already Marked Completed.' })
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
        // console.log('====================================');
        // console.log(error.message);
        // console.log('====================================');
        return res.status(200).json({ message: 'error' });
    }
}

const session_history = async (req, res) => {
    try {
        const patientId = req.user.userData._id;
        const allSessions = await doctorPatientSessionModel.find({ patientId: patientId })
        if (!allSessions) {
            throw new Error();
        }
        return res.status(200).json({ message: 'success', data: allSessions.reverse() });
    } catch (error) {
        return res.status(200).json({ message: 'error', data: [], detail: 'Error! Please try after sometime!' });

    }
}

module.exports = { previous_messages, add_message, close_session, session_history }