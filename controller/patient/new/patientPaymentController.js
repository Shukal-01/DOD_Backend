const Razorpay = require("razorpay");
const handleCreateNew = require("../../../helper/crudHelpers/new/handleCreateNew");
const {
  sendSuccess,
  sendError,
} = require("../../../helper/other/Req_Res_Search_function");
const handleUpdateNew2 = require("../../../helper/crudHelpers/new/UpdateNew2"); 
const patientModel = require("../../../model/patients.model");
const patientPaymentHistoryModel = require("../../../model/patientPaymentHistory.model");
const handleGetWithMsg = require("../../../helper/crudHelpers/GetWithMsg");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const newpaymentorderrequest = async (req, res) => {
  try {
    const patientId = req.user.userData._id;
    const { amount } = req.body;
    const currency = "INR";

    const currentEnviroment = process.env.ENVIROMENT;

    const createObj = {
      paymentId: "",
      patientId: patientId,
      status: "pending",
    };

    if (
      !currentEnviroment ||
      currentEnviroment === "" ||
      currentEnviroment !== "development"
    ) {
      // Attempt to create an order in Razorpay
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: Number.parseInt(amount), // Ensures the amount is an integer in paise
        currency: currency || "INR",
        receipt: `receipt_${patientId}`,
        payment_capture: 1,
      });

      createObj.rzpOrderId = razorpayOrder.id;

      if (!razorpayOrder || !razorpayOrder.id) {
        return res.status(500).json({
          message: "error",
          detail: "Error processing payment order request.",
        });
      }
    }

    // Call handleCreate only after ensuring Razorpay order creation
    const response = await handleCreateNew(
      req,
      patientPaymentHistoryModel,
      [],
      createObj
    );
    if (response.message === "success") {
      return sendSuccess(
        res,
        200,
        [response.data.rzpOrderId, response.data._id],
        ""
      );
    } else {
      return sendError(res, 200, "Something Went Wrong! Please try again.");
    }
  } catch (error) {
    console.error("Error in newpaymentorderrequest:", error);
    return sendError(res, 200, "Error processing payment order request.");
  }
};

const savecompletedpayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const patientId = req.user.userData._id;
    if (!orderId) {
      return res
        .status(200)
        .json({ message: "error", detail: "Order not found!" });
    }

    const response = await handleUpdateNew2(
      req,
      patientPaymentHistoryModel,
      ["orderId"],
      {
        status: "success",
      },
      "",
      {
        _id: orderId,
      }
    );

    if (response.message === "success") {
      // add amount in patient wallet

      const amount = response.data.amount / 100;

      //   const isPatientUpdated = await patientModel.findByIdAndUpdate(
      //     patientId,
      //     {
      //       $inc: {
      //         WalletAmountt: amount,
      //       },
      //     }, // Increment walletAmount by the given amount
      //     { new: true } // Return the updated document
      //   );

      const patientData = await patientModel.findById(patientId);

      const newAmount = patientData.WalletAmount + amount;

      patientData.WalletAmount = newAmount;

      const isPatientUpdated = await patientData.save();

      if (isPatientUpdated) {
        return sendSuccess(res, 200, response.data, "");
      } else {
        return sendError(res, 200, "Something went wrong! Please try again");
      }
    } else {
      return sendError(res, 200, "Something Went Wrong! Please try again.");
    }
  } catch (error) {
    console.error("Error in newpaymentorderrequest:", error);
    return sendError(res, 200, "Error processing payment order request.");
  }
};

const handleupdateerroredpayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(200)
        .json({ message: "error", detail: "Order not found!" });
    }

    const response = await handleUpdateNew2(
      req,
      patientPaymentHistoryModel,
      ["orderId"],
      {},
      "",
      {
        _id: orderId,
      }
    );

    if (response.message === "success") {
      return sendSuccess(res, 200, response.data, "");
    } else {
      return sendError(res, 200, "Something Went Wrong! Please try again.");
    }
  } catch (error) {
    console.error("Error in newpaymentorderrequest:", error);
    return sendError(res, 200, "Error processing payment order request.");
  }
};


const handleGetMyTopupPaymentHistory = async (req,res) => {
  try {
    
    const patientId = req.user.userData._id; 
    
    handleGetWithMsg(req,res,patientPaymentHistoryModel,{patientId: patientId},true);
  } catch (error) {
    return sendError(res,200,error.message);
  }

}

const patientPaymentController = {
  newpaymentorderrequest,
  savecompletedpayment,
  handleupdateerroredpayment,
  handleGetMyTopupPaymentHistory
};

module.exports = patientPaymentController;
