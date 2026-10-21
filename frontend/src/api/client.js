const isDev = import.meta.env.DEV;
let rawBase = import.meta.env.VITE_API_BASE_URL || '';
if (rawBase.includes('onrender.com')) {
  rawBase = isDev ? 'http://127.0.0.1:8000' : '';
} else if (!rawBase && isDev) {
  rawBase = 'http://127.0.0.1:8000';
}

const API_BASE = rawBase.replace(/\/$/, '');
const BASE_URL = `${API_BASE}/api`;

export function getFullImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url.startsWith('/') ? url : `/${url}`}`;
}

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('raju_admin_token');
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      // Token expired or invalid
      localStorage.removeItem('raju_admin_token');
      localStorage.removeItem('raju_admin_user');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }

    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred';
      if (data && data.detail) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map(d => `${d.loc ? d.loc.slice(1).join('.') + ': ' : ''}${d.msg}`).join(', ');
        }
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Could not connect to Raju Kirana Store server. Please ensure the backend is running.');
    }
    throw err;
  }
}
