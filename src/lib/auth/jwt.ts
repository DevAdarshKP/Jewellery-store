import { SignJWT, jwtVerify } from 'jose';
import { IUserSession } from '@/types';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super_secret_lumiere_atelier_jwt_token_key_change_in_production_2026'
);

const COOKIE_NAME = 'admin_session';

export { COOKIE_NAME };

export async function createSessionToken(payload: IUserSession): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<IUserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });

    if (payload.role !== 'ADMIN') {
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: 'ADMIN',
    };
  } catch {
    return null;
  }
}

