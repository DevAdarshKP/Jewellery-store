import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth/jwt';
import { checkRateLimit, resetRateLimit } from '@/lib/auth/rate-limiter';
import { LoginSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = LoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.isActive) {
      // Dummy verify to mitigate timing attacks
      await verifyPassword(password, '$2a$12$e8Y...dummyhashforconstanttimematch...');
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Login successful — reset rate limiter for this IP
    resetRateLimit(ip);

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Create session token
    const token = await createSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: 'ADMIN',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

