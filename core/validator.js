module.exports.validateLog = (log) => {
  if (!log.event_type) throw new Error("event_type required");
  if (!log.actor_id) throw new Error("actor_id required");
  if (!log.actor_name) throw new Error("actor_name required");
  if (!log.resource_id) throw new Error("resource_id required");
  if (!log.resource_type) throw new Error("resource_type required");
};
