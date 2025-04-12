const handleGet = require("../../helper/crudHelpers/Get");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const handleCreateNew = require("../../helper/crudHelpers/new/handleCreateNew");
const { sendError } = require("../../helper/other/Req_Res_Search_function");
const callHistoryModel = require("../../model/serviceProvider/callHistories.model");
const serviceProviderTypeModel = require("../../model/serviceProviderType.model");
const { sendSuccess } = require("../_utils/req_res_messages");

const createNewHistory = async (req, res) => {
  const isCreated = await handleCreateNew(req, callHistoryModel, [], {}, "");
  if (isCreated.message === "success") {
    return sendSuccess(res, 200, "");
  }
  return sendError(res, 200, "something went wrong!");
};

const getServiceprovidertype = (req, res) => {
  try {
    handleGet(req, res, serviceProviderTypeModel, {});
  } catch (error) {
    return sendError(res, 404, error.message);
  }
};

module.exports = { createNewHistory, getServiceprovidertype };
