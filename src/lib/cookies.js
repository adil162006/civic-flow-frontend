const TOKEN_COOKIE = 'civicflow_admin_token'
const USER_COOKIE = 'civicflow_admin_user'

export function setCookie(name, value, maxAge = 60 * 60 * 24 * 7) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
}

export function getCookie(name) {
  const prefix = `${name}=`
  const match = document.cookie.split('; ').find((entry) => entry.startsWith(prefix))
  return match ? decodeURIComponent(match.slice(prefix.length)) : null
}

export function removeCookie(name) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
}

export function saveAdminSession({ token, user }) {
  setCookie(TOKEN_COOKIE, token)
  setCookie(USER_COOKIE, JSON.stringify(user))
}

export function readAdminSession() {
  const token = getCookie(TOKEN_COOKIE)
  const rawUser = getCookie(USER_COOKIE)
  if (!token || !rawUser) return null
  try { return { token, user: JSON.parse(rawUser) } } catch { return null }
}

export function clearAdminSession() {
  removeCookie(TOKEN_COOKIE)
  removeCookie(USER_COOKIE)
}

export const getAdminToken = () => getCookie(TOKEN_COOKIE)
