import Redis from "ioredis"
import { UPSTASH_REDIS_URL } from "./env.js";

export const redis = new Redis(UPSTASH_REDIS_URL);