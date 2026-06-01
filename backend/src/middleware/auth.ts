import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};
