import { fetchApi } from './client';

export async function getCategories() {
  return await fetchApi('/categories');
}

export async function createCategory(categoryData) {
  return await fetchApi('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

export async function updateCategory(categoryId, categoryData) {
  return await fetchApi(`/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
}

export async function deleteCategory(categoryId) {
  return await fetchApi(`/categories/${categoryId}`, {
    method: 'DELETE',
  });
}
