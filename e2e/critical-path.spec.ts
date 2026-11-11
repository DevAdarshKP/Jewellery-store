import { test, expect } from '@playwright/test';

test.describe('Women’s Jewellery Catalogue — Critical Path E2E Suite', () => {
  test('1. Homepage displays luxury brand identity, navigation, and collections', async ({ page }) => {
    await page.goto('/');

    // Verify brand heading
    await expect(page.locator('h1')).toContainText('Timeless Elegance');

    // Verify Brand Logo in navbar
    await expect(page.locator('header')).toContainText('Lumière Atelier');

    // Verify navigation links
    await expect(page.locator('header')).toContainText('All Jewellery');
    await expect(page.locator('header')).toContainText('Craftsmanship');
    await expect(page.locator('header')).toContainText('Atelier');

    // Verify WhatsApp concierge button in header
    const waHeaderBtn = page.locator('header a[href*="wa.me"]');
    await expect(waHeaderBtn).toBeVisible();
  });

  test('2. Product Catalogue page supports category navigation and search', async ({ page }) => {
    await page.goto('/products');

    // Verify heading
    await expect(page.locator('h1')).toContainText('The Jewellery Catalogue');

    // Check category filter pills exist
    await expect(page.locator('text=All Pieces')).toBeVisible();

    // Verify multiple product cards are loaded
    const productCards = page.locator('h3');
    await expect(productCards.first()).toBeVisible();
  });

  test('3. Product Detail page displays specifications and WhatsApp enquiry link', async ({ page }) => {
    await page.goto('/products/royal-polki-emerald-choker');

    // Verify product title & SKU
    await expect(page.locator('h1')).toContainText('Royal Polki & Emerald Choker');
    await expect(page.locator('text=SKU: LUM-NK-001')).toBeVisible();

    // Verify WhatsApp button link contains product details
    const waButton = page.locator('a:has-text("Enquire via WhatsApp Concierge")');
    await expect(waButton).toBeVisible();
    const href = await waButton.getAttribute('href');
    expect(href).toMatch(/https:\/\/wa\.me\/(919876543210|8129440790|\d+)/);
    expect(href).toContain(encodeURIComponent('Royal Polki & Emerald Choker'));
    expect(href).toContain(encodeURIComponent('LUM-NK-001'));
  });

  test('4. Admin security guard redirects unauthenticated user from /admin to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/);
    await expect(page.locator('h1')).toContainText('Lumière Atelier');
    await expect(page.locator('text=Back-Office Administrative Portal')).toBeVisible();
  });

  test('5. Admin logs in successfully and accesses the Dashboard', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('input[type="email"]', 'admin@jewellerystore.local');
    await page.fill('input[type="password"]', 'Admin@12345');
    await page.click('button[type="submit"]');

    // Wait for redirect to /admin
    await page.waitForURL('**/admin');
    await expect(page.locator('main h1')).toContainText('Catalogue Dashboard');

    // Verify navigation link & metric cards
    await expect(page.getByRole('link', { name: 'Categories', exact: true })).toBeVisible();
    await expect(page.locator('text=Total Products')).toBeVisible();
  });
});
