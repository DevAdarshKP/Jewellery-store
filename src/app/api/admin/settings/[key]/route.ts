import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Setting } from '@/lib/db/models/Setting';
import {
  WhatsAppSettingsSchema,
  HomepageSettingsSchema,
  GeneralSettingsSchema,
} from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: { key: string };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();
    const key = params.key;

    let validatedData: any = body;
    if (key === 'whatsapp') {
      const res = WhatsAppSettingsSchema.safeParse(body);
      if (!res.success) return NextResponse.json({ error: res.error.flatten().fieldErrors }, { status: 400 });
      validatedData = res.data;
    } else if (key === 'homepage') {
      const res = HomepageSettingsSchema.safeParse(body);
      if (!res.success) return NextResponse.json({ error: res.error.flatten().fieldErrors }, { status: 400 });
      validatedData = res.data;
    } else if (key === 'general') {
      const res = GeneralSettingsSchema.safeParse(body);
      if (!res.success) return NextResponse.json({ error: res.error.flatten().fieldErrors }, { status: 400 });
      validatedData = res.data;
    }

    await connectToDatabase();

    await Setting.findOneAndUpdate(
      { key },
      { key, value: validatedData, updatedBy: session.userId },
      { upsert: true, new: true }
    );

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/products');

    return NextResponse.json({ success: true, key, value: validatedData });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}

