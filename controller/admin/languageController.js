const languages_list = require("../../data/allLanguageArray")



const get = () => {
    return res.status(200).json({ message: 'success', data: languages_list })
}

module.exports = { get }