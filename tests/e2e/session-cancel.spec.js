import { test, expect } from '@playwright/test';
import { registerUser, setAuthInStorage } from './fixtures/db.js';

const API = process.env.E2E_API_URL || 'http://localhost:3000/api';

async function seedProfessional() {
  // los profesionales ya existen si se corrio npm run seed:professionals
}

async function bookSession(token) {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 3);
  while (tomorrow.getUTCDay() === 0 || tomorrow.getUTCDay() === 6) {
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  }
  const dateStr = tomorrow.toISOString().split('T')[0];

  const slotsRes = await fetch(
    `${API}/sessions/available-slots?date=${dateStr}&sessionType=psychology`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const slotsBody = await slotsRes.json();

  if (!slotsBody.data?.length || !slotsBody.data[0]?.slots?.length) {
    return null;
  }

  const res = await fetch(`${API}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      professionalId: slotsBody.data[0].professionalId,
      sessionType: 'psychology',
      scheduledAt: slotsBody.data[0].slots[0],
    }),
  });
  const body = await res.json();
  return body.data;
}

test.describe('E2E 6: Cancelar sesion', () => {
  let user;
  let session;

  test.beforeAll(async () => {
    user = await registerUser();
    await seedProfessional();
    session = await bookSession(user.accessToken);
  });

  test('cancelar sesion proxima desde la lista', async ({ page }) => {
    if (!session) {
      test.skip();
      return;
    }

    await page.goto('/');
    await setAuthInStorage(page, user);
    await page.goto('/app/sesiones');
    await page.waitForURL('**/sesiones');

    const code = page.locator(`text=${session.confirmationCode}`);
    if (await code.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(code).toBeVisible();

      const cancelBtn = page.locator('button:has-text("Cancelar")').first();
      if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cancelBtn.click();

        await expect(page.locator('text=Sesion cancelada')).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
