import { fetchApi } from './client';

export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category_id) query.append('category_id', params.category_id);
  if (params.category_slug) query.append('category_slug', params.category_slug);
  if (params.is_available !== undefined && params.is_available !== '') query.append('is_available', params.is_available);
  if (params.is_featured !== undefined && params.is_featured !== '') query.append('is_featured', params.is_featured);
  if (params.sort_by) query.append('sort_by', params.sort_by);
  if (params.page) query.append('page', params.page);
  if (params.size) query.append('size', params.size);

  const qs = query.toString();
  return await fetchApi(`/products${qs ? `?${qs}` : ''}`);
}

export async function getProduct(id) {
  return await fetchApi(`/products/${id}`);
}

export async function createProduct(productData) {
  return await fetchApi('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id, productData) {
  return await fetchApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(id) {
  return await fetchApi(`/products/${id}`, {
    method: 'DELETE',
  });
}

export async function clearAllProducts() {
  return await fetchApi('/products/clear-all', {
    method: 'POST',
  });
}

