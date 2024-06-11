// auth-middleware.ts
import { NextFunction, Request, Response } from 'express';
import AuthService from '../auth/auth-service';
import UserService from '../auth/auth-service';  // Adjust the path as necessary

const authService = new AuthService();
const userService = new UserService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  const payload = authService.verifyJwt(token);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Add user payload to request
  (req as any).user = payload;

  // Assuming payload contains the user ID
  const user = await userService.getUserById(payload.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Add user city to request
  (req as any).city = user.city;
  next();
};
