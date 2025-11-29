CREATE TABLE IF NOT EXISTS events (
id SERIAL PRIMARY KEY,
event_type TEXT NOT NULL,
actor_id TEXT NOT NULL,
actor_name TEXT NOT NULL,             
resource_id TEXT NOT NULL,
resource_type TEXT NOT NULL,
ip_address TEXT,
user_agent TEXT,
metadata JSONB, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);