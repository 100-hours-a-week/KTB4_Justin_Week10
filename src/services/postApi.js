import { apiRequest } from './apiClient.js'

export const getPosts = () => {
  return apiRequest('/posts', 'GET')
}

export const getPost = (postId) => {
  return apiRequest(`/posts/${postId}`, 'GET')
}

export const createPost = (request) => {
  return apiRequest('/posts', 'POST', request)
}

export const updatePost = (postId, request) => {
  return apiRequest(`/posts/${postId}`, 'PATCH', request)
}

export const deletePost = (postId) => {
  return apiRequest(`/posts/${postId}`, 'DELETE')
}
