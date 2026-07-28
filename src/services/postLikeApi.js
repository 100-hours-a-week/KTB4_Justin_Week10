import { apiRequest } from './apiClient.js'

export const likePost = (postId) => {
  return apiRequest(`/posts/${postId}/likes`, 'POST')
}

export const unlikePost = (postId) => {
  return apiRequest(`/posts/${postId}/likes`, 'DELETE')
}
