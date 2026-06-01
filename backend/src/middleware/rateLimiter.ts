import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Strict login rate limiter - 5 attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    skipSuccessfulRequests: true, // Don't count successful requests
    message: 'Too many login attempts, please try again later',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many login attempts. Please try again after 15 minutes.',
        });
    },
});

// Register rate limiter - 3 registrations per hour per IP
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    skipSuccessfulRequests: false,
    message: 'Too many registration attempts, please try again later',
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many registration attempts. Please try again after 1 hour.',
        });
    },
});

// General API rate limiter - 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skipSuccessfulRequests: false,
    standardHeaders: true,
    legacyHeaders: false,
});

// Password reset rate limiter - 3 resets per hour per IP
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    skipSuccessfulRequests: false,
    message: 'Too many password reset attempts',
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many password reset attempts. Please try again after 1 hour.',
        });
    },
});
