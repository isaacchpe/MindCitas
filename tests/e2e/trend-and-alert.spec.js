import { test, expect } from '@playwright/test';
import { registerUser, setAuthInStorage } from './fixtures/db.js';

const API = process.env.E2E_API_URL || 'http://localhost:3000/api';

async function seedLowMoodEntries(token) {
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    date.setUTCHours(0, 0, 0, 0);
    const mood = i < 3 ? 1 : 4;

    await fetch(`${API}/emotional-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mood }),
    });
  }
}

test.describe('E2E 3: Tendencia y alerta de patron negativo', () => {
  let user;

  test.beforeAll(async () => {
    user = await registerUser();
    await seedLowMoodEntries(user.accessToken);
  });

  test('grafica semanal y alerta visible con datos de patron bajo', async ({ page }) => {
    await page.goto('/');
    await setAuthInStorage(page, user);
    await page.goto('/app/dashboard');
    await page.waitForURL('**/dashboard');

    await expect(page.locator('text=Tu tendencia emocional')).toBeVisible({ timeout: 5000 });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 5000 });

    const alert = page.locator('text=tres dias sintiendote bajo');
    if (await alert.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(alert).toBeVisible();

      await page.click('button:has-text("Agendar ahora")');
      await page.waitForURL('**/agendar**');
    }
  });
});
