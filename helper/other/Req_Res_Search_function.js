const sendError = (res, code, message) => {
  return res.status(code).json({ message: "error", detail: message });
};

const sendSuccess = (res, status, data, detail) => {
  return res.status(status).json({
    message: "success",
    data: data || null,
    detail: detail || null,
  });
};

const search = async (givenModel, givenObject) => {
  const isExist = await givenModel.findOne(givenObject);
  if (isExist) {
    return isExist;
  } else {
    return false;
  }
};

module.exports = { sendError, search, sendSuccess };
