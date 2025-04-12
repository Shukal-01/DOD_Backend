const { response } = require("express");
const handleCreate = require("../../helper/crudHelpers/handleCreate");
const handleUpdate = require("../../helper/crudHelpers/Update");
const patientModel = require("../../model/patients.model");
const patientWalletPaymentHistoriesModel = require("../../model/patientWalletPaymentHistories.model");
const handleGetWithMsg = require("../../helper/crudHelpers/GetWithMsg");

const newpaymentorderrequest = async (req, res) => {
  const patientId = req.user.userData._id;
  handleCreate(req, res, patientWalletPaymentHistoriesModel, [], {
    paymentId: "",
    patientId: patientId,
    status: "pending",
  });
};

const savecompletedpayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res
        .status(200)
        .json({ message: "error", detail: "Order Id not found!" });
    }

    const orderData = await patientWalletPaymentHistoriesModel.findOne({
      _id: orderId,
    });
    const amount = orderData.amount;
    const patientId = orderData.patientId;

    if (!patientId || !amount) {
      return res.status(200).json({ message: "error" });
    }

    const isPatientUpdated = await patientModel.findOneAndUpdate(
      { _id: patientId },
      { $inc: { WalletAmount: Number.parseFloat(amount) } }
    );

    if (!isPatientUpdated) {
      return res.status(200).json({ message: "error" });
    }

    handleUpdate(
      req,
      res,
      patientWalletPaymentHistoriesModel,
      ["orderId"],
      {
        status: "success",
      },
      "",
      {
        _id: orderId,
      }
    );
  } catch (error) {
    // console.log(error.message);
    // console.log(
    //   "controller / patient / walletSystemController : savecompletedpayment()"
    // );

    return res.status(200).json({ message: "error" });
  }
};

const handleupdateerroredpayment = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res
      .status(200)
      .json({ message: "error", detail: "Order not found!" });
  }

  handleUpdate(
    req,
    res,
    patientWalletPaymentHistoriesModel,
    ["orderId"],
    {},
    "",
    {
      _id: orderId,
    }
  );
};

const getbalance = async (req, res) => {
  const patientId = req.user.userData._id;
  const PatientData = await patientModel
    .findOne({ _id: patientId })
    .select("WalletAmount");
  let balance = "0";
  if (
    PatientData.WalletAmount &&
    PatientData.WalletAmount !== "" &&
    PatientData.WalletAmount !== 0
  ) {
    balance = PatientData.WalletAmount;
  }

  return res.status(200).json({ message: "success", data: balance });
};

const gettopuphistory = async (req, res) => {
  const patientId = req.user.userData._id;
  handleGetWithMsg(req, res, patientWalletPaymentHistoriesModel, {
    patientId: patientId,
  });
};

module.exports = {
  newpaymentorderrequest,
  savecompletedpayment,
  handleupdateerroredpayment,
  getbalance,
  gettopuphistory,
};
