const { sendSuccess } = require("../_utils/req_res_messages");

const handleGetDashboardSummary = async (req, res) => {
  return sendSuccess(res, 200, [
    { title: "Total Doctors Registered", value: 10 },
    { title: "Doctors Online Currently", value: 5 },
    { title: "Total Sessions Conducted", value: 10},
    { title: "Sessions for Today", value: 10 },
    { title: "Completed Sessions", value: 3650 },
    { title: "Failed Sessions", value: 125 },
    { title: "Weekly Earnings", value: "₹15,250" },
    { title: "Today's Earnings", value: "₹2,500" },
  ]);
};

const serviceProviderSummaryController = { handleGetDashboardSummary };

module.exports = serviceProviderSummaryController;