import { createClient } from "redis";
import { loadEnv } from "../config/envs";

loadEnv();

const redis = createClient({
  url: process.env.REDIS_URL
});

(async () => {
  await redis.connect();
})();

export default redis;
