const handleGet = require("../../helper/crudHelpers/Get");
const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
const departmentModel = require("../../model/department.model");
const doctorModel = require("../../model/doctors.model");
const eventModel = require("../../model/events.model");
const cityModel = require("../../model/location/city.model");
const countryModel = require("../../model/location/country.model");
const stateModel = require("../../model/location/state.model");
const medicalServicesModel = require("../../model/medicalServices.model");
const serviceProviderModel = require("../../model/serviceProvider.model");
const serviceProviderTypeModel = require("../../model/serviceProviderType.model");
const specializationModel = require("../../model/specilizations.model");

const { Country, State, City } = require("country-state-city");

const getDepartmentData = async (req, res) => {
  handleGet(req, res, departmentModel, {});
};

const getDepartmentDataWithStatus = async (req, res) => {
  handleGetWithMsg(req, res, departmentModel, {});
};

const getDoctorsData = async (req, res) => {
  handleGetWithMsg(req, res, doctorModel, {
    $or: [
      {
        isOnline: 1,
        status: "verified",
      },
      // {
      //   status: undefined,
      // },
    ],
  });
};

const getSpecializationData = async (req, res) => {
  handleGet(req, res, specializationModel, {});
};

const getSpecializationDataWithMsg = async (req, res) => {
  handleGetWithMsg(req, res, specializationModel, {});
};

// =================================================================
// const getAllCountries = async (req, res) => {
// handleGet(req, res, countryModel, {});
// };

const getAllCountries = async (req, res) => {
  try {
    // Get all countries
    const countries = Country.getAllCountries();

    // Filter to return only India (ISO code "IN")
    const india = countries.find((country) => country.isoCode === "IN");

    // Send response back to the client with the India object
    res.status(200).json({ message: "success", data: [india] });
  } catch (error) {
    // Handle errors if any
    zz.status(500).json({
      message: "success",
      detail: "Failed to retrieve country data",
    });
  }
};

// const getAllStates = async (req, res) => {
// handleGet(req, res, stateModel, {});
// };

const getAllStates = async (req, res) => {
  try {
    // Get all states in India (Country ISO code is "IN")
    const states = State.getStatesOfCountry("IN");

    // Send the list of states in India as a response
    // res.status(200).json(states);
    res.status(200).json({ message: "success", data: states });
  } catch (error) {
    // Handle errors if any
    res
      .status(500)
      .json({ message: "success", detail: "Failed to retrieve country data" });
  }
};

// const getAllCities = async (req, res) => {
//   handleGet(req, res, cityModel, {});
// };
const getAllCities = async (req, res) => {
  try {
    // Get all states in India (Country ISO code is "IN")
    const states = State.getStatesOfCountry("IN");

    let allCities = [];

    // Loop through each state and get cities
    states.forEach((state) => {
      const cities = City.getCitiesOfState("IN", state.isoCode);
      allCities = [...allCities, ...cities]; // Append cities to the overall list
    });

    // Send all cities as a response
    // res.status(200).json(allCities);
    res.status(200).json({ message: "success", data: allCities });
  } catch (error) {
    // Handle errors if any
    res
      .status(500)
      .json({ message: "success", detail: "Failed to retrieve country data" });
  }
};
// =================================================================

const getAllServiceProviderTypes = async (req, res) => {
  handleGet(req, res, serviceProviderTypeModel, {});
};

const getAllMedicalServices = async (req, res) => {
  handleGetWithMsg(req, res, medicalServicesModel, {});
};
const getAllmedicalserviceProviders = async (req, res) => {
  handleGet(req, res, serviceProviderModel, {
    status: "verified",
  });
};

const getAllEvents = async (req, res) => {
  handleGetWithMsg(req, res, eventModel, {}, true);
};

module.exports = {
  getDepartmentData,
  getDoctorsData,
  getSpecializationData,
  getSpecializationDataWithMsg,
  getAllCountries,
  getAllStates,
  getAllCities,
  getAllServiceProviderTypes,
  getAllMedicalServices,
  getAllmedicalserviceProviders,
  getAllEvents,
  // with Msg
  getDepartmentDataWithStatus,
};
