import { apiRequest } from './apiClient.js'

export const getGenres = () => {
  return apiRequest('/genres', 'GET')
}
