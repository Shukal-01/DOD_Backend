const handleUpdateNew2 = require("../../../helper/crudHelpers/new/UpdateNew2");
const dyteServices = require("../../../helper/thirdParty/dyte_service/dyty_sevices");
const doctorPatientSessionModel = require("../../../model/_new/doctor_patient_sesstion");
const patientModel = require("../../../model/patients.model");
const { sendSuccess, sendError } = require("../../_utils/req_res_messages");
const patientController = require("../../../controller/patient/new/patientSessionConroller");
const sendFirebaseNotification = require("../../../helper/push_notifications/firebasePushNotification");

const handleGetAllPendingAndAcceptedSessionRequests = async (req, res) => {
  try {
    const doctorId = req.user.userData._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    const allSessions = await doctorPatientSessionModel.find({
      doctorId: doctorId,
      $or: [
        // Uncomment these if you want to include other statuses
        // { status: "pending" },
        // { status: "accepted" },
        // { status: "ongoing" },
        { createdAt: { $gte: startOfDay, $lt: endOfDay } },
      ],
    });

    const allPatientsIds = allSessions.map((value) => {
      return { _id: value.patientId };
    });

    const allSessionPatients = await patientModel.find({ $or: allPatientsIds });

    return sendSuccess(
      res,
      200,
      {
        allSessions: allSessions,
        allSessionPatients,
      },
      ""
    );
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const handleRejectPendingSessionRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const isUpdated = await doctorPatientSessionModel.findOneAndUpdate(
      { _id: sessionId, status: "pending" },
      {
        endTime: Date.now(),
        status: "rejected",
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

const handleCancelAcceptedSessionRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const isUpdated = await doctorPatientSessionModel.findOneAndUpdate(
      { _id: sessionId, status: "accepted" },
      {
        endTime: Date.now(),
        status: "doctor_cancelled",
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

const handleAcceptPendingSessionRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const isUpdated = await doctorPatientSessionModel.findOneAndUpdate(
      { _id: sessionId, status: "pending" },
      {
        status: "accepted",
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

const handleStartSessionRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // create dyte meeeting
    const dyteCreateMeeting = await dyteServices.createNewMeeting(sessionId);
    if (dyteCreateMeeting.message !== "success") {
      return sendError(res, 200, "Error! Please try again later.");
    }

    const dyteMeetingId = dyteCreateMeeting.data.roomId;
    //  create join token for doctor and patient
    const patientDyteTokenResponse =
      await dyteServices.createDyteMeetingUserToken(
        dyteMeetingId,
        `Patient_${sessionId}`,
        `patient_${sessionId}`
      );
    const doctorDyteTokenResponse =
      await dyteServices.createDyteMeetingUserToken(
        dyteMeetingId,
        `Doctor_${sessionId}`,
        `doctor_${sessionId}`
      );

    // check if doctor and patient tokens are valid
    if (
      !(
        doctorDyteTokenResponse.message == "success" &&
        patientDyteTokenResponse.message == "success"
      )
    ) {
      return sendError(res, 200, "Error! Please try again later.");
    }

    const isUpdated = await doctorPatientSessionModel.findOneAndUpdate(
      { _id: sessionId, status: "accepted" },
      {
        status: "ongoing",
        isDoctorJoined: 1,
        dyteDetails: {
          meetingId: dyteMeetingId,
          doctorJoinToken: doctorDyteTokenResponse.data.token,
          patientJoinToken: patientDyteTokenResponse.data.token,
        },
        doctorJoiningTime: Date.now(),
      }
    );

    if (isUpdated) {
      const patientData = await patientModel.findById(isUpdated.patientId);

      await sendFirebaseNotification(
        patientData.deviceId,
        "Session started!",
        "Please join session room now."
      );
      return sendSuccess(res, 200, { sessionId: isUpdated._id }, "");
    }

    return sendError(res, 200);
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const handleGetOngoingSessionData = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionData = await doctorPatientSessionModel.findById(sessionId);
    const patientData = await patientModel.findById(sessionData.patientId);

    if (sessionData && patientData) {
      return sendSuccess(
        res,
        200,
        { sessionData: sessionData, patientData: patientData },
        ""
      );
    }

    return sendError(res, 200);
  } catch (error) {
    // console.log(error.message);

    return sendError(res, 200, error.message);
  }
};

const handleCheckForOngoingSession = async (req, res) => {
  try {
    const doctorId = req.user.userData._id;
    const isAnyOngoingSessionExists = await doctorPatientSessionModel.findOne({
      doctorId: doctorId,
      status: "ongoing",
    });

    if (isAnyOngoingSessionExists) {
      return sendSuccess(
        res,
        200,
        { sessionId: isAnyOngoingSessionExists._id },
        ""
      );
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

const handleMarkComepleteSession = async (req, res) => {
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
    sessionData.compeleteMarkedBy = "doctor";
    sessionData.endTime = Date.now();

    const isSessionUpdated = await sessionData.save();

    if (isSessionUpdated) {
      const isSuccess =
        await patientController.handleUpdateSessionPatientDoctorBalance(
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

const handleAddPrescription = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { prescriptionData } = req.body;

    // Check if prescriptionData is an array
    if (!Array.isArray(prescriptionData)) {
      return sendError(res, 200, "prescriptionData must be an array");
    }

    // Find the session by ID
    const session = await doctorPatientSessionModel.findById(sessionId);
    if (!session) {
      return sendError(res, 200, "Session not found");
    }

    // Add the new prescription list to the session
    await session.addPrescriptionList(prescriptionData);

    // Fetch the updated session and return the new sessionPrescriptions
    const updatedSession = await doctorPatientSessionModel.findById(sessionId);

    return sendSuccess(
      res,
      200,
      updatedSession.sessionPrescriptions,
      "Prescription list added successfully"
    );
  } catch (error) {
    // Log error for debugging
    console.error(error);
    return sendError(res, 200, error.message);
  }
};

const handleGetSessionHistory = async (req, res) => {
  try {
    const doctorId = req.user.userData._id;

    const allSessions = await doctorPatientSessionModel.find({
      doctorId: doctorId,
      status: { $nin: ["pending", "accepted", "ongoing"] },
    });

    return sendSuccess(res, 200, allSessions.reverse(), "");
  } catch (error) {
    return sendError(res, 200, error.message);
  }
};

const doctorSessionController = {
  handleGetAllPendingAndAcceptedSessionRequests,
  handleRejectPendingSessionRequest,
  handleCancelAcceptedSessionRequest,
  handleAcceptPendingSessionRequest,
  handleStartSessionRequest,
  handleGetOngoingSessionData,
  handleCheckForOngoingSession,
  handleAddMessageToSession,
  handleGetMessagesOfSession,
  handleMarkComepleteSession,
  handleAddPrescription,
  handleGetSessionHistory,
};

module.exports = doctorSessionController;
