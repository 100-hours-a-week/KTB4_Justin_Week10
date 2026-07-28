import { apiRequest } from './apiClient.js'

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest('/uploads', 'POST', formData)
}
