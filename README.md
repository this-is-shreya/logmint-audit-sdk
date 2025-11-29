# Hey there!
## Welcome to LogMint SDK

This SDK will help you log events directly on our cloud or in your local database just with the help of a few lines of code.

### Local Setup
- Install package using
  `npm install @logmint/audit`

- For local setup, just initailize and connect to your database:
 ```js
const { init, log } = require("@logmint/audit");
const { Pool } = require("pg");

await init({
  db: {
    client: new Pool({
      host: "localhost",
      user: "postgres",
      password: "admin",
      port: 5432,
      database: "todo",
    }),
  },
  mode: "local",
});
```

The SDK will automatically create an **events** table if it does not exist in your database. If you want to manually create it, use the query:
```sql
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
```
### Log events
```js
await log({
  event_type: "user.paid.first.order",
  actor_name: "shreya",
  actor_id: "1",
  resource_id: "#1",
  resource_type: "mobile app",
  metadata: { old_column: "old", new_column: "new" },
});
```
### Cloud Setup
- Install package using
  `npm install @logmint/audit`
```js
const { init, log, flush } = require("@logmint/audit");

await init({
  mode: "cloud",
  apiKey: "YOUR_API_KEY",
  secretKey: "YOUR_SECRET_KEY",
});
```

### Log events
In place of URL, use `https://api.getlogmint.com`
```js
await log({
  event_type: "user.paid.first.order",
  actor_name: "shreya",
  actor_id: "1",
  resource_id: "#1",
  resource_type: "mobile app",
  metadata: { old_column: "old", new_column: "new" },
}, `<URL>`);
```
If events fail to get logged, it will automatically get pushed to redis. You'll have to flush it out.(Recommended once a week).
In place of URL, use `https://api.getlogmint.com`
```js
const { flush } = require("@logmint/audit");

await flush(`<URL>`);
```
#### Contact us: support@getlogmint.com
