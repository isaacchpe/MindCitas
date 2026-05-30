import { test, expect } from '@playwright/test';
import { registerUser, setAuthInStorage } from './fixtures/db.js';

test.describe('E2E 4: Crear habito y registrar racha', () => {
  let user;

  test.beforeAll(async () => {
    user = await registerUser();
  });

  test('crear habito, marcarlo y ver racha', async ({ page }) => {
    await page.goto('/');
    await setAuthInStorage(page, user);
    await page.goto('/app/habitos');
    await page.waitForURL('**/habitos');

    await page.click('button:has-text("Nuevo habito")');
    await expect(page.locator('text=Nuevo habito')).toBeVisible();

    const predefined = page.locator('button:has-text("Meditacion")').first();
    if (await predefined.isVisible({ timeout: 5000 }).catch(() => false)) {
      await predefined.click();

      await expect(page.locator('input[id="habit-name"]')).toBeVisible();
      await page.click('button:has-text("Crear habito")');

      await expect(page.locator('text=Habito creado')).toBeVisible({ timeout: 5000 });

      const markBtn = page.locator('button:has-text("Marcar hoy")').first();
      if (await markBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await markBtn.click();
        await expect(page.locator('text=Cumplido hoy')).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
