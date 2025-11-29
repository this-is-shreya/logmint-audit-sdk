const fs = require("fs");

module.exports.initLocal = async (config) => {
  const pool = config.db.client;
  const migration = fs.readFileSync(__dirname + "/migration.sql", "utf8");
  try {
    await pool.query(migration);
    return pool;
  } catch (error) {
    throw new Error("Error in initializing Audit SDK. Could not connect to database.");
  }
};
