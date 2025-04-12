const contactRequestModel = require('../../model/contactRequest.model')

const handleCreate = require('../../helper/crudHelpers/handleCreate')

const add = (req, res) => {

    handleCreate(req, res, contactRequestModel, [], {
        status: "pending",
        created: Date.now(),
    }, "")
    // console.log('====================================');
    // console.log(req.body);
    // console.log('====================================');
    // return res.status(200).json({ message: "success" });
}

module.exports = { add }