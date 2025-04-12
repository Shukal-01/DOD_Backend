const handleDelete = require('../../helper/crudHelpers/Delete');
const handleGet = require('../../helper/crudHelpers/Get');
const handleCreate = require('../../helper/crudHelpers/handleCreate');
const handleUpdate = require('../../helper/crudHelpers/Update');
const { sendError } = require('../../helper/other/Req_Res_Search_function');
const serviceProviderTypeModel = require('../../model/serviceProviderType.model');


// ======================================= crud -----------------------------------

const add = async (req, res) => {
    try {
        handleCreate(req, res, serviceProviderTypeModel, [], {}, "")
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const get = async (req, res) => {
    try {
        handleGet(req, res, serviceProviderTypeModel, {})
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const deleteData = async (req, res) => {
    try {
        handleDelete(req, res, serviceProviderTypeModel, { _id: req.params.itemId })
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

const updateDate = async (req, res) => {
    try {

        handleUpdate(req, res, serviceProviderTypeModel, [], {}, "", {
            _id: req.params.itemId,
        })
    } catch (error) {
        return sendError(res, 404, error.message)
    }
}

// ======================================= crud -----------------------------------


module.exports = { add, get, deleteData, updateDate }


