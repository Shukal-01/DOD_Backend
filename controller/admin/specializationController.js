const handleDelete = require('../../helper/crudHelpers/Delete');
const handleGet = require('../../helper/crudHelpers/Get');
const handleCreate = require('../../helper/crudHelpers/handleCreate');
const handleUpdate = require('../../helper/crudHelpers/Update');
const { sendError } = require('../../helper/other/Req_Res_Search_function');
const specializationModel = require('../../model/specilizations.model');


// ======================================= crud -----------------------------------

const add = async (req, res) => {
    try {
        handleCreate(req, res, specializationModel, [], {}, "")
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const get = async (req, res) => {
    try {
        handleGet(req, res, specializationModel, {})
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const deleteData = async (req, res) => {
    try {
        handleDelete(req, res, specializationModel, { _id: req.params.itemId })
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const updateDate = async (req, res) => {
    try {

        handleUpdate(req, res, specializationModel, [], {}, "", {
            _id: req.params.itemId,
        })
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

// ======================================= crud -----------------------------------


module.exports = { add, get, deleteData, updateDate }


