import { apiRequest } from './apiClient.js'

export const signup = (request) => {
  return apiRequest('/auth/signup', 'POST', request)
}

export const login = (request) => {
  return apiRequest('/auth/login', 'POST', request)
}

export const logout = () => {
  return apiRequest('/auth/logout', 'POST')
}
