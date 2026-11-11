import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from './jwt';
import { IUserSession } from '@/types';

export async function getCurrentSession(): Promise<IUserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function requireAdminSession(): Promise<IUserSession> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

