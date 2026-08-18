import { getAdminToken } from './cookies'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function api(path, options = {}) {
  const token = getAdminToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.')
  return data
}

export const imageUrl = (url) => url?.startsWith('/') ? API_URL.replace('/api', '') + url : url
