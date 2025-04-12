const handleDelete = require('../../helper/crudHelpers/Delete');
const handleGet = require('../../helper/crudHelpers/Get');
const handleCreate = require('../../helper/crudHelpers/handleCreate');
const handleUpdate = require('../../helper/crudHelpers/Update');
const { sendError, search } = require('../../helper/other/Req_Res_Search_function');
const departmentModel = require('../../model/department.model');
const specializationModel = require('../../model/specilizations.model');


// ======================================= crud -----------------------------------

const add = async (req, res) => {
    try {
        let searchObj = {}
        searchObj['departmentId'] = req.body.departmentId
        let isExist = await search(departmentModel, searchObj)
        if (isExist) {
            console.log(isExist);
            return sendError(res, 404, "Department Id Already Taken")
        }
        handleCreate(req, res, departmentModel, [], {}, "")
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const get = async (req, res) => {
    try {
        handleGet(req, res, departmentModel, {})
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const deleteData = async (req, res) => {
    try {
        let departmentData = await departmentModel.findOne({ _id: req.params.itemId })
        let isExist = await specializationModel.findOne({ departmentId: departmentData.departmentId })
        if (isExist) {
            return sendError(res, 404, "Specialization uses this Department! Please assing another department to those specializations where this department is assigned.")
        }
        handleDelete(req, res, departmentModel, { _id: req.params.itemId })
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const updateDate = async (req, res) => {
    try {
        let searchObj = {}
        searchObj['departmentId'] = req.body.departmentId
        let isExist = await search(departmentModel, searchObj)
        if (isExist) {
            console.log(isExist);
            console.log(isExist._id);
            console.log(req.params.itemId);
            if (isExist._id.toString() !== req.params.itemId) {
                return sendError(res, 404, "Department Id Already Taken!")
            }
        }
        handleUpdate(req, res, departmentModel, [], {}, "", {
            _id: req.params.itemId,
        })
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

// ======================================= crud -----------------------------------


module.exports = { add, get, deleteData, updateDate }


