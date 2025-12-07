# Hey there!
## Welcome to LogMint SDK
Watch full demo <a href="https://www.youtube.com/watch?v=FHgbC97xbY0">here</a>

This SDK will help you log events directly on our cloud or in your local database just with the help of a few lines of code.
<br/>
  <img width="600" height="440" alt="674_1x_shots_so" src="https://github.com/user-attachments/assets/8bebac43-4438-4937-84fe-f1b107857a50" />

### Local Setup
- Install package using
  `npm install @logmint/sdk`

- For local setup, just initailize and connect to your database:
 ```js
const { init, log } = require("@logmint/sdk");
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
You can visualize the audit logs:

<img width="660" height="440" alt="459_1x_shots_so" src="https://github.com/user-attachments/assets/eb00495d-17be-4466-a8dc-0a69372c4fa0" />

### Cloud Setup
- Install package using
  `npm install @logmint/sdk`
```js
const { init, log, flush, addMetric } = require("@logmint/sdk");

await init({
  mode: "cloud",
  apiKey: "YOUR_API_KEY",
  secretKey: "YOUR_SECRET_KEY",
  url: "https://api.getlogmint.com"
});
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
If events fail to get logged, it will automatically get pushed to redis. You'll have to flush it out.(Recommended once a week).
```js
const { flush } = require("@logmint/sdk");

await flush();
```
### Add metrics
```js
await addMetric({
    name:"user.signup",
    value:1,
    type:"counter",
    tags:{env:"prod"}
  })
```
Once you have added the metrics, you can visualize them on the app and even create widgets:
<img width="660" height="440" alt="320_1x_shots_so" src="https://github.com/user-attachments/assets/106e61ff-824e-486f-aeea-170c9ae0a427" />
<br/>
<img width="660" height="440" alt="732_1x_shots_so" src="https://github.com/user-attachments/assets/d1ae78a6-e50c-41f9-9271-d7b9de884286" />

### Application logs
Application logs are automatically captured!

<img width="660" height="440" alt="725_1x_shots_so" src="https://github.com/user-attachments/assets/8c2a9254-fc17-4469-b160-c7614e889d6c" />


#### Contact us: support@getlogmint.com
