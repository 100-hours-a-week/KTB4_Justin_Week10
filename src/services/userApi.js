import { apiRequest } from './apiClient.js'

export function getUser(userId) {
  return apiRequest(`/users/${userId}`)
}

export function updateUser(userId, request) {
  return apiRequest(`/users/${userId}`, 'PATCH', request)
}

export function updatePassword(userId, request) {
  return apiRequest(`/users/${userId}/password`, 'PATCH', request)
}

export function deleteUser(userId) {
  return apiRequest(`/users/${userId}`, 'DELETE')
}
