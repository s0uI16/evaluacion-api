import { sanitizeObject } from '../utils/sanitizer.js';

export const sanitizeMiddleware = (req, res, next) => {
  try {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Error sanitizando datos',
      error: error.message,
    });
  }
};