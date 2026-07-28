const baseUrl = import.meta.env.API_BASE_URL

if (!baseUrl) {
  throw new Error('API_BASE_URL 환경변수가 설정되지 않았습니다.')
}

const BASE_URL = baseUrl.replace(/\/$/, '')

let unauthorizedHandler = null

export function clearAuthStorage() {
  localStorage.removeItem('userId')
  localStorage.removeItem('nickname')
  localStorage.removeItem('profileImage')
  localStorage.removeItem('accessToken')
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null
}

async function sendRequest(url, method, body, isFormData) {
  const accessToken = localStorage.getItem('accessToken')
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  const response = await fetch(BASE_URL + url, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : null,
  })

  if (response.status === 401 && !url.startsWith('/auth/')) {
    clearAuthStorage()
    unauthorizedHandler?.()
  }

  return response
}

export async function apiRequest(url, method = 'GET', body = null) {
  const isFormData = body instanceof FormData
  const response = await sendRequest(url, method, body, isFormData)

  if (!response.ok) {
    let message = 'API 요청 실패'

    try {
      const errorBody = await response.json()
      message = errorBody.message ?? message
    } catch {
    }

    const error = new Error(message)
    error.status = response.status
    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
