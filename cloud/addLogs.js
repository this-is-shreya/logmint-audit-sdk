const axios = require("axios");
const { getConfig } = require("../core/config");
let originalConsole = {};
let buffer = { logs: [] };

setInterval(() => {
  if (buffer.logs.length > 0) {
    const batch = [...buffer.logs];
    buffer.logs = [];
    addLogs({ logs: batch });
  }
}, 1000 * 60 * 10); // every 10 minutes


const addLogs = async (logs) => {
    
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
    await axios.post(`${url}/api/logs/bulk`, logs, {
      headers: {
        "x-api-key": `${config.apiKey}`,
        authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });
    console.log("logs added successfully! -", logs);
  } catch (err) {
    console.log(err);
  }
};

function getStackInfo() {
  const obj = {};
  Error.captureStackTrace(obj, getStackInfo);
  const stack = obj.stack.split("\n")[2];
  const match = stack.match(/\((.*):(\d+):(\d+)\)$/);
  if (!match) return {};
  return { file: match[1], line: match[2], column: match[3] };
}


module.exports.overrideConsoleMethods = () => {
  if (originalConsole.log) return;

  originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  const capture = (level, args) => {
    const message = args
      .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
      .join(" ");

    const stack = getStackInfo();

    buffer.logs.push({
      level,
      message,
      metadata: {
        timestamp: new Date().toISOString(),
        ...stack,
        hostname: require("os").hostname(),
        pid: process.pid,
      },
    });
  };

  console.log = (...args) => {
    originalConsole.log(...args);
    capture("info", args);
  };

  console.warn = (...args) => {
    originalConsole.warn(...args);
    capture("warn", args);
  };

  console.error = (...args) => {
    originalConsole.error(...args);
    capture("error", args);
  };
};

