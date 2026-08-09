import { apiRequest } from './apiClient.js'

function createPageQuery({ page = 0, size = 10, genre = '', keyword = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  })

  if (genre) {
    params.set('genre', genre)
  }

  if (keyword) {
    params.set('keyword', keyword)
  }

  return params
}

export const getPosts = ({ sort = 'latest', ...pageOptions } = {}) => {
  const params = createPageQuery(pageOptions)
  params.set('sort', sort)

  return apiRequest(`/posts?${params.toString()}`, 'GET')
}

export const getLikedPosts = (pageOptions = {}) => {
  const params = createPageQuery(pageOptions)

  return apiRequest(`/posts/liked?${params.toString()}`, 'GET')
}

export const getPostSuggestions = ({ keyword, size = 5 }) => {
  const params = new URLSearchParams({
    keyword,
    size: String(size),
  })

  return apiRequest(`/posts/suggestions?${params.toString()}`, 'GET')
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
