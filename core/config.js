let config = Object.freeze({
  mode: "cloud",
  apiKey: null,
  db: null,
  secretKey: null,
  url: null
});

const VALID_MODES = ["local", "cloud"];

/**
 * Set SDK configuration.
 * Only valid keys (`mode`, `db`, `apiKey`) are accepted.
 * @param {Object} opts
 * @param {"local"|"cloud"} [opts.mode]
 * @param {string|Object} [opts.db]
 * @param {string} [opts.apiKey]
 * @param {string} [opts.secretKey]
 * @param {string} [opts.url]
 */
module.exports.setConfig = (opts) => {
  const newConfig = { ...config }; // start with existing config

  // Only allow known keys
  if ("mode" in opts) {
    if (!VALID_MODES.includes(opts.mode)) {
      throw new Error(
        `Invalid mode "${opts.mode}". Must be "local" or "cloud".`
      );
    }
    newConfig.mode = opts.mode;
  }
  if (opts.mode == VALID_MODES[0] && !opts.db) {
    throw new Error("database connection string not provided for local mode");
  } else {
    newConfig.db = opts.db;
  }
  if (opts.mode == VALID_MODES[1]) {
    if (!opts.apiKey) {
      throw new Error("API key not provided for cloud mode");
    } else {
      newConfig.apiKey = opts.apiKey;
      if (!opts.secretKey) {
        throw new Error("Secret Key not provided for cloud mode");
      }
      newConfig.secretKey = opts.secretKey;
      if (!opts.url) {
        throw new Error("URL not provided");
      }
      // ensure it starts with http/https
      if (!/^https?:\/\//i.test(opts.url) || typeof opts.url !== "string" || opts.url.trim().length === 0) {
        throw new Error("Invalid URL");
      }
      newConfig.url = opts.url;
    }
  }

  // Freeze to prevent accidental mutation
  config = Object.freeze(newConfig);
};

module.exports.getConfig = () => config;
