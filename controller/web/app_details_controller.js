const { sendSuccess } = require("../_utils/req_res_messages");

const handleGetUserAppDetails = async (req, res) => {
  return sendSuccess(res, 200, {
    version: "1.0.0",
    minimum_version: "1.0.0",
    message: "Please Update Your App!",
    updateLink: "https://play.google.com/store/games",
  });
};

const handleGetServiceProviderAppDetails = async (req, res) => {
  return sendSuccess(res, 200, {
    version: "1.0.0",
    minimum_version: "1.0.0",
    message: "Please Update Your App!",
    updateLink: "https://play.google.com/store/games",
  });
};

const appDetailsController = {
  handleGetUserAppDetails,
  handleGetServiceProviderAppDetails,
};

module.exports = appDetailsController;
