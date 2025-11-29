module.exports.writeLocal = async (pool, log) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO events (event_type, actor_id, actor_name, resource_id, resource_type, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        log.event_type,
        log.actor_id,
        log.actor_name,
        log.resource_id,
        log.resource_type,
        log.ip_address || null,
        log.user_agent || null,
        log.metadata || {}
      ]
    );

    await client.query("COMMIT");
    console.log("logged successfully! -", log)
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
