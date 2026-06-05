import { CONSTANTS } from '../config/constants.js';

const ipRequestCache = new Map();

const WINDOW_MS = 60 * 1000; // نافذة دقيقة واحدة لكل عميل
const MAX_REQUESTS = 60;     // سقف 60 طلباً في الدقيقة

/**
 * TrendAura DDOS Mitigation & Rate Limiting Guard
 */
export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown-client';
  const currentTime = Date.now();

  if (!ipRequestCache.has(ip)) {
    ipRequestCache.set(ip, { count: 1, startTime: currentTime });
    return next();
  }

  const clientData = ipRequestCache.get(ip);
  const timeElapsed = currentTime - clientData.startTime;

  if (timeElapsed > WINDOW_MS) {
    ipRequestCache.set(ip, { count: 1, startTime: currentTime });
    return next();
  }

  clientData.count += 1;

  if (clientData.count > MAX_REQUESTS) {
    return res.status(CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: 'تم رصد حركة مرور كثيفة؛ يرجى التوقف عن إغراق السيرفر والمحاولة بعد دقيقة واحدة.'
    });
  }

  return next();
};