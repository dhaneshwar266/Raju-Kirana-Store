import { fetchApi } from './client';

export async function getStoreSettings() {
  return await fetchApi('/store-settings');
}

export async function updateStoreSettings(settingsData) {
  return await fetchApi('/store-settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  });
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  return await fetchApi('/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getAdminOverview() {
  return await fetchApi('/admin/overview');
}
