const callHistoryModel = require("../../model/serviceProvider/callHistories.model");

const getCallHistories = async (req, res) => {
  const serviceProviderId = req.user.userData._id;
  const allCallHistories = await callHistoryModel.find({
    serviceProviderId: serviceProviderId,
  });
  return res
    .status(200)
    .json({ message: "success", data: allCallHistories.reverse() });
};

module.exports = { getCallHistories };
