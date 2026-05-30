const API = process.env.E2E_API_URL || 'http://localhost:3000/api';

export async function registerUser(data = {}) {
  const payload = {
    name: data.name || 'E2E User',
    email: data.email || `e2e-${Date.now()}@test.com`,
    password: data.password || 'TestPass123',
  };

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  return {
    ...payload,
    userId: body.data?.user?._id,
    accessToken: body.data?.accessToken,
    refreshToken: body.data?.refreshToken,
  };
}

export async function loginUser(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  return body.data;
}

export async function createEmotionalEntry(token, { date, mood, note }) {
  await fetch(`${API}/emotional-entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mood, note }),
  });
}

export async function seedEmotionalEntries(token, entries) {
  for (const entry of entries) {
    await createEmotionalEntry(token, entry);
  }
}

export async function setAuthInStorage(page, user) {
  await page.evaluate(
    ({ accessToken, refreshToken, userData }) => {
      const state = {
        state: {
          user: userData,
          accessToken,
          refreshToken,
        },
        version: 0,
      };
      localStorage.setItem('auth-storage', JSON.stringify(state));
      localStorage.setItem('onboarding-completed', 'true');
    },
    {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      userData: { _id: user.userId, name: user.name, email: user.email },
    }
  );
}
