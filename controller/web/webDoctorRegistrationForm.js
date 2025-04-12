const handleCreate = require('../../helper/crudHelpers/handleCreate')
const webDoctorRegistrationFormModel = require('../../model/webDoctorRegistrationForm')

const saveForm = (req, res) => {
    handleCreate(req, res, webDoctorRegistrationFormModel, [], {
        status: 'pending',
    }, "")
}

module.exports = { saveForm }