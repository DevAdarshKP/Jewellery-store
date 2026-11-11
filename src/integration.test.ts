import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import { Category } from '@/lib/db/models/Category';
import { Product } from '@/lib/db/models/Product';
import { Setting } from '@/lib/db/models/Setting';
import { generateWhatsAppEnquiryLink } from '@/lib/whatsapp/link-generator';
import { createSessionToken } from '@/lib/auth/jwt';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

describe('Milestone 5 Integration Verification', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    // Clean up test items
    await Product.deleteMany({ sku: { $regex: /^TEST-/ } });
    await Category.deleteMany({ slug: { $regex: /^test-/ } });
  });

  it('1. Verifies password hashing and verification with bcrypt', async () => {
    const rawPass = 'SecretAdminPass123!';
    const hash = await hashPassword(rawPass);
    expect(hash).not.toBe(rawPass);
    expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);

    const isValid = await verifyPassword(rawPass, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('WrongPassword', hash);
    expect(isInvalid).toBe(false);
  });

  it('2. Verifies session token creation and claims', async () => {
    const session = {
      userId: '6723a1000000000000000001',
      email: 'admin@jewellerystore.local',
      name: 'Director',
      role: 'ADMIN' as const,
    };
    const token = await createSessionToken(session);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('3. Verifies category and product integration lifecycle (Create, Update, Unpublish)', async () => {
    // A. Create test category
    const cat = await Category.create({
      name: 'Test Bridal Collection',
      slug: `test-bridal-${Date.now()}`,
      description: 'Handcrafted test ornaments',
      displayOrder: 99,
      isActive: true,
    });
    expect(cat._id).toBeDefined();

    // B. Create product linked to category as PUBLISHED
    const prod = await Product.create({
      title: 'Test Regal Choker',
      slug: `test-regal-choker-${Date.now()}`,
      sku: `TEST-NK-${Date.now()}`,
      categoryId: cat._id,
      summary: 'Test summary for luxury choker',
      description: 'Long craftsmanship narrative for testing purposes.',
      metal: '22K Gold',
      purity: '91.6%',
      status: 'PUBLISHED',
      isFeatured: true,
      images: [
        {
          url: '/uploads/test-choker.jpg',
          alt: 'Test Choker',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      attributes: [{ group: 'Specs', key: 'Net Weight', value: '45g' }],
    });
    expect(prod._id).toBeDefined();

    // C. Verify public query finds the published product
    const publicFind = await Product.findOne({
      _id: prod._id,
      status: 'PUBLISHED',
    }).populate('categoryId');
    expect(publicFind).not.toBeNull();
    expect(publicFind?.title).toBe('Test Regal Choker');
    expect((publicFind?.categoryId as any).name).toBe('Test Bridal Collection');

    // D. Update product title
    prod.title = 'Test Regal Choker (Updated)';
    await prod.save();
    const updatedFind = await Product.findById(prod._id);
    expect(updatedFind?.title).toBe('Test Regal Choker (Updated)');

    // E. Unpublish (change to DRAFT) -> must NOT appear in public query
    prod.status = 'DRAFT';
    await prod.save();
    const publicQueryAfterUnpublish = await Product.findOne({
      _id: prod._id,
      status: 'PUBLISHED',
    });
    expect(publicQueryAfterUnpublish).toBeNull();
  });

  it('4. Verifies WhatsApp enquiry URL formatting with product data', () => {
    const waUrl = generateWhatsAppEnquiryLink({
      phoneNumber: '919876543210',
      productName: 'Royal Polki & Emerald Choker',
      productSku: 'LUM-NK-001',
      productUrl: 'http://localhost:3000/products/royal-polki-emerald-choker',
    });

    expect(waUrl).toBe(
      'https://wa.me/919876543210?text=' +
        encodeURIComponent(
          'Hello Lumière Atelier, I would like to enquire about "Royal Polki & Emerald Choker" (Code: LUM-NK-001). Link: http://localhost:3000/products/royal-polki-emerald-choker'
        )
    );
  });

  it('5. Verifies settings persistence for WhatsApp & Homepage CMS', async () => {
    const testKey = 'test_whatsapp';
    await Setting.findOneAndUpdate(
      { key: testKey },
      { key: testKey, value: { phoneNumber: '919876543210', messageTemplate: 'Custom template {productName}' } },
      { upsert: true, new: true }
    );

    const saved = await Setting.findOne({ key: testKey });
    expect(saved?.value.phoneNumber).toBe('919876543210');
    expect(saved?.value.messageTemplate).toBe('Custom template {productName}');

    await Setting.deleteOne({ key: testKey });
  });
});

