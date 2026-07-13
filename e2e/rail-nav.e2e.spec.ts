import { expect, test } from '@playwright/test';

test.describe('Rail navigation', () => {
  test('clicking a module reveals Operation/Setup/Report, and selecting an item navigates', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Toggle navigation width' }).click();
    await page.getByRole('button', { name: 'Customers' }).click();

    await expect(page.getByText('Operation', { exact: true })).toBeVisible();
    await expect(page.getByText('Setup', { exact: true })).toBeVisible();
    await expect(page.getByText('Report', { exact: true })).toBeVisible();

    await page.getByText('Operation', { exact: true }).hover();
    await page.getByRole('button', { name: 'List' }).click();

    await expect(page).toHaveURL(/customers\/list/);
  });

  test('theme picker updates the active accent', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Light/ }).click();
    await page.getByText('Navy Banking').click();

    await expect(page.locator('body')).toHaveAttribute('data-theme', 'navy');
    await expect(page.locator('body')).toHaveClass(/dark/);
  });
});
