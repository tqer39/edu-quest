import { expect, test } from '@playwright/test';

const ensureBaseURL = (baseURL?: string): string => {
  if (!baseURL) {
    throw new Error('baseURL is not configured');
  }
  return baseURL;
};

test.describe('EduQuest Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Home Page', () => {
    test('should load the home page successfully', async ({
      page,
      baseURL,
    }) => {
      const resolvedBaseURL = ensureBaseURL(baseURL);
      await expect(page).toHaveURL(new URL('/', resolvedBaseURL).toString());
      await expect(page.locator('h1').getByText('EduQuest')).toBeVisible();
    });

    test('should display navigation to MathQuest', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'MathQuest' })).toBeVisible();
    });
  });

  test.describe('MathQuest Navigation Flow', () => {
    test('should navigate from home to math grade selection page', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'MathQuest' }).click();
      await expect(page).toHaveURL(/\/math/);
      await expect(page.getByText('学年を選んでください')).toBeVisible();
    });

    test('should display grade selection when visiting /math directly', async ({
      page,
    }) => {
      await page.goto('/math');
      await expect(page).toHaveURL(/\/math/);
      await expect(page.getByText('学年を選んでください')).toBeVisible();
    });

    test('should navigate from grade selection to mode selection page', async ({
      page,
    }) => {
      await page.goto('/math');
      await page.getByRole('link', { name: '小学1年生' }).click();
      await expect(page).toHaveURL(/\/math\/select/);
      await expect(page.getByText('学習方法を選んでください')).toBeVisible();
    });

    test('should complete navigation flow: home → math → grade → mode select → quest select → start', async ({
      page,
    }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'MathQuest' }).click();
      await expect(page).toHaveURL(/\/math/);
      await expect(page.getByText('学年を選んでください')).toBeVisible();

      await page.getByRole('link', { name: '小学1年生' }).click();
      await expect(page).toHaveURL(/\/math\/select/);
      await expect(page.getByText('学習方法を選んでください')).toBeVisible();

      await page.locator('a[href*="/math/quest"]').click();
      await expect(page).toHaveURL(/\/math\/quest/);
      await expect(page.getByText('クエストを選んでください')).toBeVisible();

      await page.getByRole('link', { name: 'たし算' }).click();
      await expect(page).toHaveURL(/\/math\/start/);
      await expect(
        page.getByText('たし算のテーマを選んでください')
      ).toBeVisible();
    });
  });

  test.describe('ClockQuest Navigation Flow', () => {
    test('should navigate from home to clock home page', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'ClockQuest' }).click();
      await expect(page).toHaveURL(/\/clock/);
    });
  });

  test.describe('Back Navigation', () => {
    test('should navigate back from math start to math home', async ({
      page,
    }) => {
      // Simulate actual user flow with navigation history
      await page.goto('/');
      await page.getByRole('link', { name: 'MathQuest' }).click();
      await page.getByRole('link', { name: '小学1年生' }).click();
      await page.locator('a[href*="/math/quest"]').click();
      await page.getByRole('link', { name: 'たし算' }).click();
      await expect(page).toHaveURL(/\/math\/start/);

      // Now test back navigation
      await page.goBack();
      await expect(page).toHaveURL(/\/math\/quest/);
    });

    test('should navigate back from math home to main home', async ({
      page,
      baseURL,
    }) => {
      await page.goto('/math');
      await page.goBack();
      const resolvedBaseURL = ensureBaseURL(baseURL);
      await expect(page).toHaveURL(new URL('/', resolvedBaseURL).toString());
    });
  });
});
