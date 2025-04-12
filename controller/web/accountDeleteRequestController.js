const saveNewAccountDeleteRequest = async (req, res) => {
  console.log("====================================");
  console.log("web / account delete request is pending");
  console.log("====================================");
  return res.status(200).json({ message: "success" });
};

module.exports = { saveNewAccountDeleteRequest };
