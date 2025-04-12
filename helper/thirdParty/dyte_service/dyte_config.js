require("dotenv").config();
const orgId = process.env.DYTE_ORGANIZATION_ID;
const apiKey = process.env.DYTE_API_KEY;

const dyteConfig = {
  orgId,
  apiKey,
};

module.exports = dyteConfig;
