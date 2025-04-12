// Change from ES Modules export
// export const sendError = (res, status, detail) => {
//   return res.status(status).json({ message: "error", detail });
// };

// To CommonJS export
module.exports.sendError = (res, status, detail) => {
  return res.status(status).json({ message: "error", detail });
};

module.exports.sendSuccess = (res, status, data, detail) => {
  return res.status(status).json({
    message: "success",
    data: data || null,
    detail: detail || null,
  });
};
