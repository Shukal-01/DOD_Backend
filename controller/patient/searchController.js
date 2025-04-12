const doctorModel = require("../../model/doctors.model");

const handleSearchDoctors = async (req, res) => {
  try {
    const searchText = req.params.searchText;
    let data = [];
    //   ----- doctor
    const allDoctors = await doctorModel.find({
      $or: [
        // { $text: { $search: searchText } },
        { name: { $regex: searchText, $options: "i" } },
      ],
    });

    data = [...data, ...allDoctors];
    //   ----- doctor

    return res.status(200).json({ message: "success", data: data });
  } catch (error) {
    return res.status(200).json({ message: "error", data: [] });
  }
};

module.exports = { handleSearchDoctors };
