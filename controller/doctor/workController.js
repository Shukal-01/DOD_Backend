const handleUpdate = require("../../helper/crudHelpers/Update");
const {
  getCurrentDateFormated,
} = require("../../helper/date&TimeFunctions/date_Time_functions");
const doctorWorkStatusHistoryModel = require("../../model/doctor/doctorWorkStatusHistoryModel");
const doctorModel = require("../../model/doctors.model");
const { sendSuccess, sendError } = require("../_utils/req_res_messages");

const comeonline = async (req, res) => {
  const doctorId = req.user.userData._id;

  // Fetch doctor data
  const doctorData = await doctorModel.findById(doctorId);
  if (!doctorData) {
    return sendError(res, 200, "Please restart app and try again.");
  }

  // Check if doctor is already online
  if (doctorData.isOnline === 1) {
    return sendError(res, 200, "Doctor is already online");
  }

  // Extract values from the request body
  const { doctorOrOrganization, idOf, chatRate, videoCallRate, audioCallRate } =
    req.body;

  // Check for missing values
  if (
    [doctorOrOrganization, idOf, chatRate, videoCallRate, audioCallRate].some(
      (val) => val == null
    )
  ) {
    return sendError(res, 200, "Please restart app and try again.");
  }

  // Update doctor data
  doctorData.isOnline = 1;
  doctorData.currentOnlineFor = {
    doctorOrOrganization,
    idOf,
    chatRate,
    videoCallRate,
    audioCallRate,
    _date: getCurrentDateFormated(),
    comeOnlineAt: Date.now(),
  };

  // Save the updated data
  try {
    const isDoctorUpdated = await doctorData.save();
    if (isDoctorUpdated) {
      return sendSuccess(res, 200, "Doctor is now online", "");
    } else {
      return sendError(res, 200, "Failed to update doctor status");
    }
  } catch (error) {
    return sendError(
      res,
      200,
      "Error updating doctor status: " + error.message
    );
  }
};

const gooffline = async (req, res) => {
  const doctorId = req.user.userData._id;

  // Fetch doctor data
  const doctorData = await doctorModel.findById(doctorId);
  if (!doctorData) {
    return sendError(
      res,
      200,
      "Doctor not found. Please restart app and try again."
    );
  }

  // Check if doctor is already offline
  if (doctorData.isOnline === 0) {
    return sendError(res, 200, "Doctor is already offline");
  }

  if (
    !doctorData.currentOnlineFor ||
    !doctorData.currentOnlineFor.comeOnlineAt
  ) {
    return sendError(res, 200, "No valid session found. Please restart app.");
  }

  const goingOfflineTime = Date.now();
  const totalTime =
    (goingOfflineTime - doctorData.currentOnlineFor.comeOnlineAt) / 1000;

  const newHistoryOfWork = {
    doctorId: doctorId,
    ...doctorData.currentOnlineFor,
    goneOfflineAt: goingOfflineTime,
    totalDuration: totalTime,
  };

  try {
    // Save history of work
    const isHistoryAdded = await doctorWorkStatusHistoryModel.create(
      newHistoryOfWork
    );
    if (!isHistoryAdded) {
      return sendError(
        res,
        200,
        "Failed to save history. Please refresh app and try again."
      );
    }

    // Update doctor status
    doctorData.isOnline = 0;
    doctorData.currentOnlineFor = {};

    const isDoctorUpdated = await doctorData.save();
    if (isDoctorUpdated) {
      return sendSuccess(res, 200, "Doctor is now offline", "");
    } else {
      return sendError(res, 200, "Failed to update doctor status");
    }
  } catch (error) {
    return sendError(res, 200, "Error while going offline: " + error.message);
  }
};

module.exports = { comeonline, gooffline };
