import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AUTH_CONFIG, DEMO_USER } from '@/lib/auth/config';

export const runtime = 'nodejs'; // Force Node.js runtime

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    console.log('Processing login request');
    
    const body = await req.json();
    console.log('Login attempt for email:', body.email);
    
    const { email, password } = loginSchema.parse(body);

    // Simple credential check for MVP
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      console.log('Credentials valid, generating token');
      
      const token = jwt.sign(
        {
          userId: DEMO_USER.id,
          email: DEMO_USER.email,
          role: DEMO_USER.role,
        },
        AUTH_CONFIG.secret,
        { expiresIn: AUTH_CONFIG.expiresIn }
      );

      console.log('Token generated successfully');

      return NextResponse.json({
        token,
        user: {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          role: DEMO_USER.role,
        },
      });
    }

    console.log('Invalid credentials for email:', email);
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 