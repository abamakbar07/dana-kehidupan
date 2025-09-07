import { test, expect } from '@playwright/test';

test('sign in with demo and view dashboard', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(process.env.DEMO_EMAIL || 'demo@example.com');
  await page.getByLabel('Password').fill(process.env.DEMO_PASSWORD || 'demo1234');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard');
  await expect(page.getByText('Income (30d)')).toBeVisible();
});

