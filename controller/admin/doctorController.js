const doctorModel = require("../../model/doctors.model");

// ----------------------------------------------------------------
// crud handlers
const handleDelete = require("../../helper/crudHelpers/Delete");
const handleUpdate = require("../../helper/crudHelpers/Update");
// ----------------------------------------------------------------

const get = async (req, res) => {
  let data = await doctorModel.find();
  return res.status(200).json({ message: "success", data: data });
};

const deleteData = async (req, res) => {
  handleDelete(req, res, doctorModel, { _id: req.params.itemId });
};

const updateDate = async (req, res) => {
  // handleUpdate(req, res, doctorRegistrationModel, [], {}, "", {
  //     _id: req.params.itemId,
  // });
  // const givenStatus = req.body.status;

  try {
    handleUpdate(
      req,
      res,
      doctorModel,
      [],
      {
        ...{},
        ...(req.body.approvedWorkingOrganizations
          ? {
              approvedWorkingOrganizations: JSON.parse(
                req.body.approvedWorkingOrganizations
              ),
            }
          : {}),
      },
      "",
      {
        _id: req.params.itemId,
      }
    );
  } catch (error) {
    console.log("====================================");
    console.log(error.message);
    console.log("====================================");
    return res.status(200).json({
      message: "error",
      detail: "Something went wrong! Please try again.",
    });
  }
};

module.exports = { get, deleteData, updateDate };
