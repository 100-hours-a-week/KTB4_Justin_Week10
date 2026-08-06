import { apiRequest } from './apiClient.js'

export const getComments = (postId, { page = 0, size = 10 } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  })

  return apiRequest(
    `/posts/${postId}/comments?${params.toString()}`,
    'GET',
  )
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
