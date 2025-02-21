import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '@/lib/auth/config';

export const runtime = 'nodejs'; // Force Node.js runtime

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith(AUTH_CONFIG.tokenPrefix)) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.slice(AUTH_CONFIG.tokenPrefix.length);
    const payload = jwt.verify(token, AUTH_CONFIG.secret);

    return NextResponse.json({
      valid: true,
      user: payload,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
} 