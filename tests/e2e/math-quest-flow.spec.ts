import { expect, test } from '@playwright/test';

test.describe('MathQuest Flow', () => {
  test.describe('Theme Selection Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/math');
      await page.getByRole('link', { name: '小学1年生' }).click();
      await page.getByRole('link', { name: 'クエストに挑戦する' }).click();
      await page.getByRole('link', { name: 'たし算' }).click();
    });

    test('should load the theme selection page', async ({ page }) => {
      await expect(page).toHaveURL(/\/math\/start/);
      await expect(page.getByText('たし算のテーマを選んでください')).toBeVisible();
    });

    test('should display play settings', async ({ page }) => {
      await expect(page.getByText('プレイ設定')).toBeVisible();
    });

    test('should display question count selection', async ({ page }) => {
      await expect(page.getByText('問題数')).toBeVisible();
    });

    test('should have theme selection cards', async ({ page }) => {
      await expect(page.locator('[class*="grid"]').first()).toBeVisible();
    });
  });

  test.describe('Play Page Navigation', () => {
    test('should navigate to play page after selecting theme', async ({ page }) => {
      await page.goto('/math');
      await page.getByRole('link', { name: '小学1年生' }).click();
      await page.getByRole('link', { name: 'クエストに挑戦する' }).click();
      await page.getByRole('link', { name: 'たし算' }).click();

      await page.locator('a[href*="/math/play"]').first().click();

      await expect(page).toHaveURL(/\/math\/play/);
    });

    test('should display question on play page', async ({ page }) => {
      await page.goto('/math');
      await page.getByRole('link', { name: '小学1年生' }).click();
      await page.getByRole('link', { name: 'クエストに挑戦する' }).click();
      await page.getByRole('link', { name: 'たし算' }).click();

      await page.locator('a[href*="/math/play"]').first().click();

      await expect(page).toHaveURL(/\/math\/play/);
      await expect(page.getByText('もんだい')).toBeVisible();
    });
  });

  test.describe('Backward Compatibility Redirects', () => {
    test('should redirect /start to /math/start', async ({ page }) => {
      await page.goto('/start');
      await expect(page).toHaveURL(/\/math/);
    });

    test('should allow visiting /play directly', async ({ page }) => {
      const response = await page.goto('/play');
      expect(response?.status()).toBeLessThan(500);
    });
  });
});
