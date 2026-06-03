import { buildServer } from "./app.js";

import { env } from "./configs/env/env.js";

const app = await buildServer();

try {
  await app.listen({
    port: env.PORT,
    host: "0.0.0.0",
  });
} catch (error) {
  app.log.error(error);

  process.exit(1);
}
