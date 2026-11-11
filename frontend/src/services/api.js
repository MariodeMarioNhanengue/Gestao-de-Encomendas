export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:1111'
const TOKEN_KEY = 'admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, options = {}, auth = false) {
  const headers = { ...(options.headers || {}) }
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (res.status === 401 && auth) {
    clearToken()
    window.location.href = '/admin/login'
    throw new Error('Sessão expirada')
  }
  const body = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) {
    const campos = body?.campos ? ' ' + Object.values(body.campos).join('; ') : ''
    throw new Error((body?.erro ?? `Erro ${res.status}`) + campos)
  }
  return body
}

export const api = (path, options) => request(path, options, false)
export const adminApi = (path, options) => request(path, options, true)
export const ping = () => api('/api/ping')

const json = (method, data) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})

export const adminLogin = (email, password) => api('/api/admin/login', json('POST', { email, password }))

export const categoriasAdmin = {
  listar: () => adminApi('/api/admin/categories'),
  criar: (d) => adminApi('/api/admin/categories', json('POST', d)),
  atualizar: (id, d) => adminApi(`/api/admin/categories/${id}`, json('PUT', d)),
  ativar: (id, value) => adminApi(`/api/admin/categories/${id}/active?value=${value}`, { method: 'PATCH' }),
}

export const produtosAdmin = {
  listar: (categoryId) => adminApi('/api/admin/products' + (categoryId ? `?categoryId=${categoryId}` : '')),
  obter: (id) => adminApi(`/api/admin/products/${id}`),
  criar: (formData) => adminApi('/api/admin/products', { method: 'POST', body: formData }),
  atualizar: (id, formData) => adminApi(`/api/admin/products/${id}`, { method: 'PUT', body: formData }),
  ativar: (id, value) => adminApi(`/api/admin/products/${id}/active?value=${value}`, { method: 'PATCH' }),
  removerFoto: (id, imageId) => adminApi(`/api/admin/products/${id}/images/${imageId}`, { method: 'DELETE' }),
  fotoPrincipal: (id, imageId) => adminApi(`/api/admin/products/${id}/images/${imageId}/main`, { method: 'PATCH' }),
}

export const formatMZN = (v) =>
  new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v ?? 0)
