const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
const API = BASE + '/api/v1/admin';

let token = localStorage.getItem('admin_token') || '';

export function getToken() { return token }

export function setToken(t) { token = t; if (t) localStorage.setItem('admin_token', t); else localStorage.removeItem('admin_token') }

async function request(url, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + url, { ...opts, headers });
  if (res.status === 401) { setToken(''); window.location.reload() }
  return res.json();
}

export const api = {
  login: (u, p) => request('/login', { method: 'POST', body: JSON.stringify({ username: u, password: p }) }),
  stats: () => request('/stats'),
  getProducts: (page = 1) => request('/products?page=' + page + '&size=100'),
  saveProduct: (id, data) => id ? request('/products/' + id, { method: 'PUT', body: JSON.stringify(data) }) : request('/products', { method: 'POST', body: JSON.stringify(data) }),
  delProduct: (id) => request('/products/' + id, { method: 'DELETE' }),
  getOrders: (status = 'all') => request('/orders?page=1&size=100&status=' + status),
  setOrderStatus: (id, status) => request('/orders/' + id + '/status', { method: 'PUT', body: JSON.stringify({ status }) }),
  getUsers: (kw = '') => request('/users?page=1&size=100' + (kw ? '&keyword=' + kw : '')),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(API + '/upload', { method: 'POST', headers, body: formData }).then(r => r.json());
  },
  // Categories
  getCategories: () => request('/categories'),
  saveCategory: (id, data) => id ? request('/categories/' + id, { method: 'PUT', body: JSON.stringify(data) }) : request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  delCategory: (id) => request('/categories/' + id, { method: 'DELETE' }),
  // Spec Groups
  getSpecGroups: () => request('/spec-groups'),
  saveSpecGroup: (id, data) => id ? request('/spec-groups/' + id, { method: 'PUT', body: JSON.stringify(data) }) : request('/spec-groups', { method: 'POST', body: JSON.stringify(data) }),
  delSpecGroup: (id) => request('/spec-groups/' + id, { method: 'DELETE' }),
  addSpecOption: (groupId, data) => request('/spec-groups/' + groupId + '/options', { method: 'POST', body: JSON.stringify(data) }),
  updateSpecOption: (id, data) => request('/spec-options/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  delSpecOption: (id) => request('/spec-options/' + id, { method: 'DELETE' }),
};
