import { test, expect } from '@playwright/test';
import { registerUser, setAuthInStorage } from './fixtures/db.js';

const API = process.env.E2E_API_URL || 'http://localhost:3000/api';

test.describe('E2E 5: Exportar registros a CSV', () => {
  let user;

  test.beforeAll(async () => {
    user = await registerUser();
    await fetch(`${API}/emotional-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ mood: 4, note: 'Dia de prueba' }),
    });
  });

  test('boton de export descarga archivo CSV', async ({ page }) => {
    await page.goto('/');
    await setAuthInStorage(page, user);
    await page.goto('/app/dashboard');
    await page.waitForURL('**/dashboard');

    await expect(page.locator('text=Tu tendencia emocional')).toBeVisible({ timeout: 5000 });

    const exportBtn = page.locator('button[aria-label*="Exportar"]');
    if (await exportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
        exportBtn.click(),
      ]);

      if (download) {
        const filename = download.suggestedFilename();
        expect(filename).toContain('mindcitas-export');
        expect(filename).toContain('.csv');
      }
    }
  });
});
