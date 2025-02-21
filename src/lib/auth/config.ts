export const AUTH_CONFIG = {
  secret: process.env.JWT_SECRET || 'default-secret-key-for-development-only',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  tokenPrefix: 'Bearer ',
};

export const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  password: 'demo123',
  role: 'user' as const,
}; 