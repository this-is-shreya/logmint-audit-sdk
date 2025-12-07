const { setConfig, getConfig } = require("./core/config");
const { validateLog } = require("./core/validator");

const { initLocal } = require("./local/initLocal");
const { writeLocal } = require("./local/writeLocal");

const { sendToCloud } = require("./cloud/sendToCloud");
const retryQueue = require("./cloud/retryQueue");
const { addMetrics } = require("./cloud/addMetrics");
const { overrideConsoleMethods } = require("./cloud/addLogs");

let pool = null;
/**
 * Initializes the Audit SDK.
 *
 * @typedef {Object} Config - Initialization options.
 * @property {"local"|"cloud"} mode - Current mode.
 * @property {string | Object} [db] - Database URL string or a database config object.
 * @property {Object} db.client - A database client/pool instance (e.g., new Pool()).
 * @property {string} [apiKey] - API key for cloud mode.
 * @property {string} [secretKey] - Secret key for cloud mode.
 * @property {string} [url] - URL for cloud mode
 *
 */

/**
 * Initializes the Audit SDK.
 *
 * @param {Config} options - Initialization options.
 * @example
 * // Local mode
 * init({
 *   mode: "local",
 *   db: { client: new Pool({ connectionString: "postgres://..." }) }
 * });
 *
 * @example
 * // Cloud mode
 * init({
 *   mode: "cloud",
 *   apiKey: "my-project-api-key"
 * });
 */
module.exports.init = async (options) => {
  try {
    setConfig(options);

    const config = getConfig();

    if (config.mode === "local") {
      pool = await initLocal(config);
    }
    else{
      overrideConsoleMethods();
    }

    console.log(`Audit log SDK initialized in ${config.mode} mode`);
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @typedef {Object} AuditLog
 * @property {string} project_id - Project ID (needed if config.mode is 'local')
 * @property {string} event_type - Event type.
 * @property {string} actor_id - Actor ID.
 * @property {string} actor_name - Actor name.
 * @property {string} resource_id - Resource ID.
 * @property {string} resource_type - Resource type.
 * @property {string} [user_agent] - User agent.
 * @property {string} [ip_address] - IP address.
 * @property {Object} metdata - Metadata.
 */
/**
 * @param {AuditLog} log
 */
module.exports.log = async (log) => {
  try {
    validateLog(log);

    const config = getConfig();

    if (config.mode === "local") {
      await writeLocal(pool, log);
    }

    if (config.mode === "cloud") {
      await sendToCloud(log, false);
    }
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Flushes pending logs.
 * Processes any logs stored in the retry queue and attempts
 * to send them again (only in cloud mode).
 * @returns {Object} summary - If mode is "cloud", it returns a summary of
 * logs sent, requeued and dead
 */
module.exports.flush = async () => {
  try {
    const config = getConfig();

    if (config.mode === "cloud") {
      const summary = await retryQueue.flush(config);
      return summary;
    }
  } catch (error) {
    throw new Error("Could not execute flush");
  }
};

/**
 * @typedef {Object} Metric
 * @property {string} name - metric name.
 * @property {string} value - value.
 * @property {string} type - ["gauge", "counter", "histogram"].
 * @property {Object} tags - tags.
 */
/**
 * @param {Metric} metric
 */
module.exports.addMetric = async (metric) => {
  try {
    const config = getConfig();

    if (config.mode === "cloud") {
      await addMetrics(metric);
    }
  } catch (error) {
    throw new Error("Could not add metric");
  }
};
