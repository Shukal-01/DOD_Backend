const { default: mongoose } = require('mongoose')
const moongoose = require('mongoose')

const countrySchema = mongoose.Schema({
    name: { type: String },
    code: { type: String, unique: true },
    status: { type: String },
})

const countryModel = mongoose.model('countries', countrySchema)


module.exports = countryModel;