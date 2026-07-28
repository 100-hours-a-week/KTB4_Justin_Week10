import { apiRequest } from './apiClient.js'

export const getComments = (postId) => {
  return apiRequest(`/posts/${postId}/comments`, 'GET')
}

export const createComment = (postId, request) => {
  return apiRequest(`/posts/${postId}/comments`, 'POST', request)
}

export const deleteComment = (postId, commentId) => {
  return apiRequest(`/posts/${postId}/comments/${commentId}`, 'DELETE')
}

export const updateComment = (postId, commentId, request) => {
  return apiRequest(`/posts/${postId}/comments/${commentId}`, 'PATCH', request)
}
