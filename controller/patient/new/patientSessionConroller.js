const handleCreateNew = require("../../../helper/crudHelpers/new/handleCreateNew");
const {
  getTimeDifference,
} = require("../../../helper/date&TimeFunctions/date_Time_functions");
const {
  sendError,
  sendSuccess,
} = require("../../../helper/other/Req_Res_Search_function");
const sendFirebaseNotification = require("../../../helper/push_notifications/firebasePushNotification");
const doctorPatientSessionModel = require("../../../model/_new/doctor_patient_sesstion");
const doctorSingleSessionChargesModel = require("../../../model/doctor/doctorSingleSessionCharges");
const doctorModel = require("../../../model/doctors.model");
const patientModel = require("../../../model/patients.model");
const serviceProviderModel = require("../../../model/serviceProvider.model");

// ----------------------------------- ============
const minimumMinutesBalanceRequired = 3;
// ----------------------------------- ============

const createNewRequest = async (req, res) => {
  try {
    const patientId = req.user.userData._id;
    const { initialConnectionMethod, doctorId, _sessionType, sessionTypeId } =
      req.body;

    const doctorData = await doctorModel.findById(doctorId);

    // -- check if patient have enough balance --
    const currentOnlineFor = doctorData.currentOnlineFor;
    const methodChargePerMinute =
      initialConnectionMethod === "chat"
        ? currentOnlineFor.chatRate
        : initialConnectionMethod === "video"
        ? currentOnlineFor.videoCallRate
        : currentOnlineFor.audioCallRate;

    const patientData = await patientModel.findById(patientId);

    let _laterRequiredData = {};
    console.log(_sessionType);
    console.log(sessionTypeId);
    if (sessionTypeId && _sessionType && _sessionType === "single_session") {
  
      
      const selectedSingleSessionDetails =
        await doctorSingleSessionChargesModel.findById(sessionTypeId);

      if (!selectedSingleSessionDetails) {
        return sendError(res, 200, "Something went wrong! Please try again.");
      }

      if (patientData.WalletAmount < selectedSingleSessionDetails.rate) {
        return sendError(
          res,
          200,
          `Request failed. Kindly recharge your wallet to ensure a minimum balance of ₹${selectedSingleSessionDetails.rate} which required to proceed with the session request.`
        );
      }

      _laterRequiredData.singleChargeSession = {};
      _laterRequiredData.singleChargeSession.time =
        selectedSingleSessionDetails.time;
      _laterRequiredData.singleChargeSession.rate =
        selectedSingleSessionDetails.rate;
    } else if (
      patientData.WalletAmount <
      methodChargePerMinute * minimumMinutesBalanceRequired
    ) {
      return sendError(
        res,
        200,
        `Request failed. Kindly recharge your wallet to ensure a minimum balance of ₹${
          methodChargePerMinute * minimumMinutesBalanceRequired
        }, as a balance for at least ${minimumMinutesBalanceRequired} minutes is required to proceed with the session request.`
      );
    }
    // -- check if patient have enough balance --

    // check if connecting to self
    if (doctorData.patientId == patientId) {
      return sendError(res, 200, "Cannot connect to self!");
    }

    // check if any session is pending for customer
    const patientPendingSession = await doctorPatientSessionModel.findOne({
      patientId: patientId,
      fulfilled: 0,
    });

    if (patientPendingSession) {
      return sendError(
        res,
        200,
        `existing_pending_session__${patientPendingSession._id}`
      );
    }

    //   ============================================================
    // check if doctor is online and available for this method
    if (doctorData.isOnline === 0) {
      return sendError(res, 200, "doctor is offline");
    }

    if (doctorData[initialConnectionMethod] === 0) {
      return sendError(res, 200, "doctor is unavailable for this method!");
    }

    //   ============================================================

    const skipArray = [];

    const extraObj = {
      patientId,
      _targetChatCallVideoCallAndOtherAmounts: {
        chatRate: doctorData.currentOnlineFor.chatRate,
        videoCallRate: doctorData.currentOnlineFor.videoCallRate,
        audioCallRate: doctorData.currentOnlineFor.audioCallRate,
        // add other chages accordingly as needed
      },
      _targetDoctorOrOrganization:
        doctorData.currentOnlineFor.doctorOrOrganization,
      _targetId: doctorData.currentOnlineFor.idOf,
      _sessionType: _sessionType,
    };

    console.log("ok - good");
    // for single charge session
    if (sessionTypeId && _sessionType && _sessionType === "single_session") {
      extraObj._targetChatCallVideoCallAndOtherAmounts.singleChargeSession = {
        time: _laterRequiredData.singleChargeSession.time,
        rate: _laterRequiredData.singleChargeSession.rate,
      };
    }

    console.log("ok - good 2");
    const isCreated = await handleCreateNew(
      req,
      doctorPatientSessionModel,
      skipArray,
      extraObj
    );
    // console.error(isCreated);

    if (isCreated.message == "success") {
      // send push notification to doctor
      await sendFirebaseNotification(
        doctorData.deviceId,
        "New Patient Request!",
        "Please take a look at new request."
      );

      return sendSuccess(res, 200, { sessionDataId: isCreated.data._id }, "");
    }

    return sendError(res, 200);
  } catch (error) {
    return sendError(res, 200);
  }
};

const handleGetSessionDataForPatient = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // console.error(sessionId);
    const sessionData = await doctorPatientSessionModel.findById(sessionId);
    const doctorData = await doctorModel.findById(sessionData.doctorId);
    return sendSuccess(
      res,
      200,
      { sessionData: sessionData, doctorData: doctorData },
      ""
    );
  } catch (error) {
    // console.error(error.message);

    return sendError(res, 200, "");
  }
};

const handleCancelSessionRequestFromPatientSide = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 1. Find the session by ID
    const session = await doctorPatientSessionModel.findById(sessionId);

    if (!session) {
      return sendError(res, 200, "Session not found.");
    }

    // 2. Check the current status
    if (
      session.status === "pending" ||
      session.status === "accepted" ||
      session.status == "ongoing"
    ) {
      // patient already joined now then cannot but it is completed
      if (session.isPatientJoined === 1) {
        // mark session as completed becouse patient is joined
        session.status = "completed";
        session.fulfilled = 1;
        session.compeleteMarkedBy = "patient";
        session.endTime = Date.now();

        await session.save();
        const isSuccess = await handleUpdateSessionPatientDoctorBalance(
          sessionId
        );
        if (isSuccess == "success") {
          return sendSuccess(res, 200, "Session Completed successfully.", "");
        } else {
          return sendError(
            res,
            200,
            "Session did not update! Please try again."
          );
        }
      }

      // 3. If status is pending/accepted, update to cancelled
      session.status = "cancelled";
      session.fulfilled = 1;
      session.endTime = Date.now();
      await session.save();

      return sendSuccess(res, 200, "Session cancelled successfully.", "");
    }

    // 4. If status is something else, return the existing status
    return sendError(res, 200, `Session is already '${session.status}'.`);
  } catch (error) {
    console.error("Error:", error.message);
    return sendError(res, 200, "Server error.");
  }
};

const handleGetUnfulfilledPatientSession = async (req, res) => {
  try {
    const patientId = req.user.userData._id;
    const unfulfilledSession = await doctorPatientSessionModel.findOne({
      patientId: patientId,
      fulfilled: 0,
    });
    if (unfulfilledSession) {
      return sendSuccess(res, 200, { sessionId: unfulfilledSession._id });
    }
    return sendError(res, 200, "");
  } catch (error) {
    return sendError(res, 200, "");
  }
};

const handleFulfilledSessionRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const isUpdated = await doctorPatientSessionModel.findOneAndUpdate(
      { _id: sessionId },
      {
        fulfilled: 1,
      }
    );

    if (isUpdated) {
      return sendSuccess(res, 200, { sessionId: isUpdated._id }, "");
    }

    return sendError(res, 200);
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const handlePatientAcceptAndJoinSession = async (req, res) => {
  try {
    const patientId = req.user.userData._id;
    const { sessionId } = req.params;



    const sessionData = await doctorPatientSessionModel.findById(sessionId);
    if (!sessionData) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    console.log('comming 1');

    // Extract necessary data from session
    const {
      initialConnectionMethod,
      _targetChatCallVideoCallAndOtherAmounts: rates,
    } = sessionData;

    // Determine charge rate based on session method
    const methodChargePerMinute =
      initialConnectionMethod === "chat"
        ? rates.chatRate
        : initialConnectionMethod === "video"
        ? rates.videoCallRate
        : rates.audioCallRate;

    const patientData = await patientModel.findById(patientId);
    console.log('comming 2');
    let patientAvailableSeconds;

    if (sessionData._sessionType === "single_session") {
      
      patientAvailableSeconds =
        sessionData._targetChatCallVideoCallAndOtherAmounts.singleChargeSession.time * 60;
    } else {

      console.log('comming 3');
      patientAvailableSeconds =
        patientData.WalletAmount / (methodChargePerMinute / 60);
    }
    console.log('comming 4');
    const isUpdated = await doctorPatientSessionModel.findOneAndUpdate(
      { _id: sessionId, status: "ongoing" },
      {
        isPatientJoined: 1,
        patientJoiningTime: Date.now(),
        _patientAvailableSeconds: patientAvailableSeconds,
        startTime: new Date(Date.now() + 10000), // actual countdown will start from 10 seconds later
        _feesTransactionStatus: "pending",
      }
    );
    console.log('comming 00');
    if (isUpdated) {
      console.log('comming');
      return sendSuccess(res, 200, { sessionId: isUpdated._id }, "");
    }

    return sendError(res, 200);
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const handleAddMessageToSession = async (req, res) => {
  try {
    const { sessionId } = req.params; // Session ID from request params
    const { sessionSingleMessage } = req.body; // New message from request body

    // Validate sessionSingleMessage
    if (
      !sessionSingleMessage ||
      !sessionSingleMessage.userId ||
      !sessionSingleMessage.message
    ) {
      return sendError(res, 400, "Invalid message format.");
    }

    // Add the new message to the sessionMessages array
    const isUpdated = await doctorPatientSessionModel.findOneAndUpdate(
      { _id: sessionId, status: "ongoing" }, // Match ongoing session by ID
      {
        $push: {
          sessionMessages: {
            userId: sessionSingleMessage.userId,
            Message: sessionSingleMessage.message,
            dateTime: new Date(),
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (isUpdated) {
      return sendSuccess(
        res,
        200,
        {
          sessionId: isUpdated._id,
          sessionMessages: isUpdated.sessionMessages,
        },
        "Message added successfully."
      );
    }

    return sendError(res, 404, "Session not found or not ongoing.");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

const handleGetMessagesOfSession = async (req, res) => {
  try {
    const { sessionId } = req.params; // Session ID from request params
    const sessionData = await doctorPatientSessionModel.findById(sessionId);

    if (sessionData) {
      const messages = sessionData.sessionMessages;
      if (Array.isArray(messages)) {
        return sendSuccess(res, 200, { messages: messages }, "");
      }
    }

    return sendError(res, 200, "No Session Data Found!");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

const handleEndSession = async (req, res) => {
  try {
    const { sessionId } = req.params; // Session ID from request params

    const sessionData = await doctorPatientSessionModel.findById(sessionId);
    if (!sessionData) {
      return sendError(res, 200, "No Session Data Found!");
    }

    if (
      ["rejected", "doctor_cancelled", "cancelled", "completed"].includes(
        sessionData.status
      )
    ) {
      return sendError(res, 200, `error__already_closed`);
    }

    // session is in ongoing state now marking complete
    sessionData.status = "completed";
    sessionData.fulfilled = 1;
    sessionData.compeleteMarkedBy = "patient";
    sessionData.endTime = Date.now();

    const isSessionUpdated = await sessionData.save();

    if (isSessionUpdated) {
      const isSuccess = await handleUpdateSessionPatientDoctorBalance(
        sessionId
      );
      if (isSuccess == "success") {
        return sendSuccess(res, 200, "Session Completed successfully.", "");
      } else {
        return sendError(res, 200, "Session did not update! Please try again.");
      }
    } else {
      return sendError(res, 200, "Session did not update! Please try again.");
    }
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error.message);
  }
};

const handleGetSessionHistory = async (req, res) => {
  try {
    const patientId = req.user.userData._id;

    const allSessions = await doctorPatientSessionModel.find({
      patientId: patientId,
      status: { $nin: ["pending", "accepted", "ongoing"] },
    });

    return sendSuccess(res, 200, allSessions, "");
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const handleUpdateSessionPatientDoctorBalance = async (sessionId) => {
  try {
    // Fetch session data
    const sessionData = await doctorPatientSessionModel.findById(sessionId);
    if (!sessionData) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Extract necessary data from session
    const {
      initialConnectionMethod,
      _targetChatCallVideoCallAndOtherAmounts: rates,
      startTime,
      endTime,
      doctorId,
      patientId,
    } = sessionData;

    // Determine charge rate based on session method
    const methodChargePerMinute =
      initialConnectionMethod === "chat"
        ? rates.chatRate
        : initialConnectionMethod === "video"
        ? rates.videoCallRate
        : rates.audioCallRate;

    // Validate session timings
    if (!startTime || !endTime) {
      throw new Error(`Invalid session timings for session: ${sessionId}`);
    }

    const totalSeconds =
      getTimeDifference(startTime, endTime).seconds +
      getTimeDifference(startTime, endTime).minutes * 60;
    let totalAmount;
    if (sessionData._sessionType === "single_session") {
      totalAmount =
        sessionData._targetChatCallVideoCallAndOtherAmounts.singleChargeSession
          .rate;
    } else {
      // Calculate session duration and total amount
      totalAmount = totalSeconds * (methodChargePerMinute / 60);
    }
    // Update session with duration and fee amount
    await doctorPatientSessionModel.findByIdAndUpdate(sessionId, {
      $set: { _feesAmount: totalAmount, sessionDuration: totalSeconds },
    });

    // Fetch and update patient wallet
    const patient = await patientModel.findById(patientId);
    if (!patient) throw new Error(`Patient not found: ${patientId}`);
    if (patient.WalletAmount === undefined) {
      throw new Error(
        `Patient wallet not initialized for patient: ${patientId}`
      );
    }
    patient.WalletAmount -= totalAmount;
    await patient.save();

    const targetDoctorOrOrganization = sessionData._targetDoctorOrOrganization;
    const targetId = sessionData._targetId;

    if (targetDoctorOrOrganization == "organization") {
      // Update doctor wallet atomically

      // console.log(sessionData._targetId);
      // console.log(targetId);

      const serviceProvider = await serviceProviderModel.findById(targetId);

      let prevBalance = 0;
      if (serviceProvider.currentBalance) {
        prevBalance = serviceProvider.currentBalance;
      }

      const serviceProviderUpdate =
        await serviceProviderModel.findByIdAndUpdate(
          targetId,
          {
            currentBalance: prevBalance + totalAmount,
          },
          { new: true, upsert: true } // Return updated document and create if doesn't exist
        );

      if (!serviceProviderUpdate) {
        throw new Error(`Service Provider not found: ${targetId}`);
      }
    } else {
      // Update doctor wallet atomically
      const doctorUpdate = await doctorModel.findByIdAndUpdate(
        targetId,
        { $inc: { currentBalance: totalAmount } },
        { new: true } // Return updated document (if needed)
      );
      if (!doctorUpdate) {
        throw new Error(`Doctor not found: ${targetId}`);
      }
    }
    return "success";
  } catch (error) {
    // console.log(error.message);

    return "error";
  }
};

const patientSessionConroller = {
  createNewRequest,
  handleGetSessionDataForPatient,
  handleCancelSessionRequestFromPatientSide,
  handleGetUnfulfilledPatientSession,
  handleFulfilledSessionRequest,
  handlePatientAcceptAndJoinSession,
  handleAddMessageToSession,
  handleGetMessagesOfSession,
  handleEndSession,
  handleGetSessionHistory,
  handleUpdateSessionPatientDoctorBalance,
};

module.exports = patientSessionConroller;
