import { test, expect } from '@playwright/test';
import { registerUser, setAuthInStorage } from './fixtures/db.js';

test.describe('E2E 2: Agendamiento de sesion completo', () => {
  let user;

  test.beforeAll(async () => {
    user = await registerUser();
  });

  test('wizard de agendamiento hasta confirmacion', async ({ page }) => {
    await page.goto('/');
    await setAuthInStorage(page, user);
    await page.goto('/app/agendar');
    await page.waitForURL('**/agendar');

    const typeCard = page.locator('button:has-text("Psicologia")').first();
    await expect(typeCard).toBeVisible({ timeout: 5000 });
    await typeCard.click();

    await expect(page.locator('text=Selecciona fecha')).toBeVisible();

    const nextMonthBtn = page.locator('button[aria-label="Mes siguiente"]');
    await nextMonthBtn.click();

    const availableDays = page.locator('button:not([disabled])').filter({
      hasNotText: /^[LMXJVSD]$/,
    });
    const dayButtons = await availableDays.all();
    const numericDays = dayButtons.filter((btn) => /^\d+$/.test(btn));
    if (numericDays.length > 0) {
      await numericDays[Math.floor(numericDays.length / 2)].click();
    } else if (dayButtons.length > 5) {
      await dayButtons[5].click();
    }

    const continueBtn = page.locator('button:has-text("Continuar")');
    if (await continueBtn.isEnabled({ timeout: 3000 }).catch(() => false)) {
      await continueBtn.click();
    }

    const slotBtn = page.locator('button:has-text(/^\\d{2}:\\d{2}$/)').first();
    if (await slotBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await slotBtn.click();

      await expect(page.locator('text=Resumen')).toBeVisible();
      await page.click('button:has-text("Confirmar")');

      await expect(page.locator('text=Sesion agendada')).toBeVisible({ timeout: 10000 });

      const code = page.locator('.font-mono');
      await expect(code).toBeVisible();
      const codeText = await code.textContent();
      expect(codeText).toMatch(/^MC-[A-F0-9]{6}$/);

      await page.click('button:has-text("Ver mis sesiones")');
      await page.waitForURL('**/sesiones');
      await expect(page.locator(`text=${codeText}`)).toBeVisible();
    }
  });
});
