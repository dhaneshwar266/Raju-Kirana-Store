import { fetchApi } from './client';

export async function login(usernameOrEmail, password) {
  const data = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username_or_email: usernameOrEmail,
      password,
    }),
  });
  if (data.access_token) {
    localStorage.setItem('raju_admin_token', data.access_token);
    localStorage.setItem('raju_admin_user', JSON.stringify(data.user));
  }
  return data;
}

export async function getMe() {
  return await fetchApi('/auth/me');
}

export async function logout() {
  try {
    await fetchApi('/auth/logout', { method: 'POST' });
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem('raju_admin_token');
    localStorage.removeItem('raju_admin_user');
  }
}
