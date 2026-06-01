import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const isDev = process.env.NODE_ENV !== 'production';
  
  // Log error safely (no sensitive data)
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    error: err.message,
    ...(isDev && { stack: err.stack }),
  }, null, 2));

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: isDev ? err.message : 'An error occurred',
    ...(isDev && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
