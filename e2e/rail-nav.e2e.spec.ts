import { expect, test } from '@playwright/test';

async function signIn(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/dashboard/);
}

test.describe('Rail navigation', () => {
  test('clicking a module group reveals modules/categories, and selecting a mega-panel feature navigates', async ({ page }) => {
    await signIn(page);

    await page.getByRole('button', { name: 'Compliance' }).click();
    await page.getByRole('button', { name: 'KYC' }).click();

    await expect(page.getByText('Operation', { exact: true })).toBeVisible();
    await expect(page.getByText('Setup', { exact: true })).toBeVisible();
    await expect(page.getByText('Report', { exact: true })).toBeVisible();

    await page.getByText('Operation', { exact: true }).hover();
    await page.getByRole('button', { name: 'KYC Profile' }).click();

    await expect(page).toHaveURL(/compliance\/kyc\/operation\/kyc-profile/);
  });

  test('theme picker updates the active accent', async ({ page }) => {
    await signIn(page);

    await page.getByRole('button', { name: /Light/ }).click();
    await page.getByText('Navy Banking').click();

    await expect(page.locator('body')).toHaveAttribute('data-theme', 'navy');
    await expect(page.locator('body')).toHaveClass(/dark/);
  });
});
