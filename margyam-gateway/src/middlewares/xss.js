import xss from 'xss';

/**
 * xssClean — Strips XSS payloads from request body strings.
 */
export const xssClean = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
};
