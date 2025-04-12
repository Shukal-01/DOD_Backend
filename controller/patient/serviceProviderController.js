const handleGet = require("../../helper/crudHelpers/Get");
const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const doctorModel = require("../../model/doctors.model");
const medicalServicesModel = require("../../model/medicalServices.model");
const serviceProviderModel = require("../../model/serviceProvider.model");
const serviceProviderProfileGalleriesModel = require("../../model/serviceProvider/serviceProviderProfileGalleries.model");
const serviceProviderReviewModel = require("../../model/serviceProvider/serviceProviderReview.model");
const serviceProviderServiceCategoriesModel = require("../../model/serviceProvider/serviceProviderServiceCategories.model");
const serviceProviderServicesModel = require("../../model/serviceProvider/serviceProviderServices.model");
const { sendError, sendSuccess } = require("../_utils/req_res_messages");

const addNewRating = async (req, res) => {
  try {
    const { serviceProviderId, RatingValue } = req.body;
   
    // Fetch and update the service provider in one go
    const updatedServiceProvider = await serviceProviderModel.findOneAndUpdate(
      { _id: serviceProviderId },
      {
        $inc: {
          rating: Number.parseInt(RatingValue), // Increment rating
          ratingCount: 1, // Increment rating count
        },
      },
      { new: true } // Return the updated document
    );

    // If no service provider is found
    if (!updatedServiceProvider) {
      // return res.status(404).json({ message: "Service provider not found" });
      return sendError(res, 200, "Service provider not found");
    }

    const successCallback = (givenAddedRating) => {
      sendSuccess(res, 200, {
        serviceProvider: updatedServiceProvider,
        newRating: givenAddedRating,
      });
    };
    // Handle review creation after updating the rating
    handleCreate(
      req,
      res,
      serviceProviderReviewModel,
      [],
      {},
      "",
      null,
      successCallback
    );
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
    });
  }
};

const getAllRatings = async (req, res) => {
  try {
    handleGetWithMsg(
      req,
      res,
      serviceProviderReviewModel,
      {
        serviceProviderId: req.params.serviceProviderId,
      },
      true
    );
  } catch (error) {
    return res.status(400).json({ message: "error", data: [] });
  }
};

const getAllGalleryImages = async (req, res) => {
  try {
    const serviceProviderId = req.params._id;
    handleGetWithMsg(
      req,
      res,
      serviceProviderProfileGalleriesModel,
      {
        serviceProviderId: serviceProviderId,
      },
      true
    );
  } catch (error) {
    // console.log(error);

    return res.status(200).json({ message: "error", data: [] });
  }
};

const getAllServiceProviderServiceCategories = async (req, res) => {
  handleGetWithMsg(req, res, serviceProviderServiceCategoriesModel, {});
};

const getAllServiceProviderServices = async (req, res) => {
  handleGetWithMsg(req, res, serviceProviderServicesModel, {});
};

const getThisCategoryServiceProviders = async (req, res) => {
  const { categoryId } = req.params; 
  handleGetWithMsg(req, res, serviceProviderModel, { category: categoryId });
};

const getAllCategoriesAdvertiesedServiceProviders = async (req, res) => {
  try {
    const allCategories = await medicalServicesModel.find();
    const allAdvertisedServiceProviders = [];
    for (let i = 0; i < allCategories.length; i++) {
      const category = allCategories[i];
      const serviceProviders = await serviceProviderModel
        .find({ category: category._id })
        .limit(3);
      allAdvertisedServiceProviders = [
        ...allAdvertisedServiceProviders,
        ...serviceProviders,
      ];
    }
 
    return res
      .status(200)
      .json({ message: "success", data: allAdvertisedServiceProviders });
  } catch (error) {
    return res.status(500).json({ message: "error", data: [] });
  }
};

const getAllDoctorsOfThisOrganization = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    // Validate serviceProviderId
    if (!serviceProviderId || typeof serviceProviderId !== "string") {
      return sendError(res, 200, "Invalid service provider ID!");
    }

    // Fetch doctors with filtering
    handleGetWithMsg(req, res, doctorModel, {
      isOnline: 1, // Changed 1 to `true` for better readability
      "currentOnlineFor.doctorOrOrganization": "organization",
      "currentOnlineFor.idOf": serviceProviderId, // Ensure this matches stored type
    });
  } catch (error) {
    console.error("Error in getAllDoctorsOfThisOrganization:", error);
    return sendError(res, 200, "Internal server error!");
  }
};

const handleCheckIsServiceProviderOnline = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    const serviceProvider = await serviceProviderModel.findById(
      serviceProviderId
    );
    if (serviceProvider.isOnline == 1) {
      return sendSuccess(res, 200, [], "");
    }
    return sendError(res, 200, "Internal server error!");
  } catch (error) {
    return sendError(res, 200, "Internal server error!");
  }
};

module.exports = {
  addNewRating,
  getAllRatings,
  getAllGalleryImages,
  getAllServiceProviderServiceCategories,
  getAllServiceProviderServices,
  getThisCategoryServiceProviders,
  getAllCategoriesAdvertiesedServiceProviders,
  getAllDoctorsOfThisOrganization,
  handleCheckIsServiceProviderOnline,
};
