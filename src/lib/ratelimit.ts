import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Utilizza un mock fittizio se le chiavi Redis non sono configurate (es. in locale/sviluppo)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL.replace(/^['"]|['"]$/g, ''),
        token: process.env.UPSTASH_REDIS_REST_TOKEN.replace(/^['"]|['"]$/g, ''),
      })
    : null;

// Riferimento condiviso del rate limiter: 5 richieste ogni 10 secondi per gli endpoint principali
export const globalRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 s'),
      analytics: true,
      prefix: '@upstash/ratelimit/portfolio',
    })
  : {
      limit: async () => ({ success: true, limit: 10, remaining: 9, reset: 0 }),
    };

// Rate limiter più permissivo per feedback / piccoli endpoint non LLM
export const feedbackRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: false,
      prefix: '@upstash/ratelimit/feedback',
    })
  : {
      limit: async () => ({ success: true, limit: 10, remaining: 9, reset: 0 }),
    };
