import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Using default secret for development.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload: JWTPayload): string {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  } catch (error) {
    console.error('Error getting token from request:', error);
    return null;
  }
}

export function getUserFromToken(token: string): JWTPayload | null {
  try {
    return verifyToken(token);
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
} 