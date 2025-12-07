// retryQueue.js
const axios = require("axios");

async function add(log, config) {
  try {
    const url = config.url;
    await axios.post(
      `${url}/api/redis/queue`,
      { log, api_key: config.apiKey },
      {
        headers: {
          "x-api-key": `${config.apiKey}`,
          authorization: `Bearer ${config.secretKey}`,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );
  } catch (error) {
    console.log("Failed to add log to retry queue:", error);
  }
}

async function flush(config) {
  try {
    const url = config.url;
    const result = await axios.post(
      `${url}/api/redis/flush`,
      { api_key: config.apiKey, secret_key: config.secretKey },
      {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );
    return result;
  } catch (error) {
    return { error: "Failed to flush queue:" + error};
  }
}

module.exports = { add, flush };
