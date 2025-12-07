const axios = require("axios");
const { getConfig } = require("../core/config");

module.exports.addMetrics = async (metric) => {
  const config = getConfig();
  const url = config.url;
  try {
    // verify api key and secret key
    const result = await axios.post(
      `${url}/api/sdk/verify`,
      {
        secret_key: config.secretKey,
        api_key: config.apiKey,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );

    if (result.status != 200) {
      console.log("Could not add log: ", result.data.msg);
      return;
    }
    await axios.post(`${url}/api/metrics`, metric, {
      headers: {
        "x-api-key": `${config.apiKey}`,
        authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });
    console.log("metric added successfully! -", metric);
  } catch (err) {
    console.log(err);
  }
};
