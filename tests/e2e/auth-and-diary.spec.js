import { test, expect } from '@playwright/test';

test.describe('E2E 1: Registro, login y primer registro emocional', () => {
  test('flujo completo de registro a dashboard con registro emocional', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('onboarding-completed', 'true'));

    await page.goto('/register');
    await page.waitForURL('**/register');

    const email = `e2e-${Date.now()}@test.com`;

    await page.fill('input[name="name"]', 'Usuario E2E');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPass123');
    await page.fill('input[name="passwordConfirm"]', 'TestPass123');
    await page.click('input[type="checkbox"]');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Hola')).toBeVisible();

    await page.click('a[href="/app/diario"]');
    await page.waitForURL('**/diario');
    await expect(page.locator('text=Diario emocional')).toBeVisible();

    const moodButtons = page.locator('button[aria-pressed]');
    await moodButtons.nth(3).click();

    await page.fill('textarea', 'Me siento mejor hoy');

    await page.click('button:has-text("Guardar registro")');

    await expect(page.locator('text=Registro guardado')).toBeVisible({ timeout: 5000 });

    await page.click('a[href="/app/dashboard"]');
    await page.waitForURL('**/dashboard');

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });
  });
});
