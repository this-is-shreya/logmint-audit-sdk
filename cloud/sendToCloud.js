const axios = require("axios");
const { getConfig } = require("../core/config");
const queue = require("./retryQueue");

module.exports.sendToCloud = async (log, isFlush, url) => {
  const config = getConfig();
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    console.log("Invalid URL passed to sendToCloud");
    return;
  }
  
  // ensure it starts with http/https
  if (!/^https?:\/\//i.test(url)) {
    console.log("URL must start with http:// or https://");
    return;
  }
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
    
    if(result.status != 200) {
      console.log("Could not add log: ", result.data.msg);
      return;
    }
    await axios.post(`${url}/api/events`, log, {
      headers: {
        "x-api-key": `${config.apiKey}`,
        authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });
    console.log("log added successfully! -", log);
    
  } catch (err) {
    console.log(err);
    
    if(!isFlush) {
      queue.add(log, config, url); // fallback to retry queue
      console.log("added to retry queue");
      
    }
    return new Error("Cloud send failed → queued");
  }
};
