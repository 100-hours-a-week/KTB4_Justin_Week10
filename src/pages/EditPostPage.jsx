import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PostForm from '../components/post/PostForm.jsx'
import { getPost, updatePost } from '../services/postApi.js'
import { uploadImage } from '../services/uploadApi.js'
import {
  API_ERROR_CODE,
  getApiErrorMessage,
} from '../utils/apiError.js'

function getFileNameFromUrl(url) {
  if (!url) return null

  return url.split('/').pop()
}

function EditPostPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await getPost(postId)
        setPost(response.data)
      } catch (error) {
        window.alert(getApiErrorMessage(error))

        if (error.message === API_ERROR_CODE.POST_NOT_FOUND) {
          navigate('/posts', { replace: true })
        }
      }
    }

    loadPost()
  }, [navigate, postId])

  const handleSubmit = async ({ title, content, imageFile }) => {
    const request = { title, content }

    try {
      if (imageFile) {
        const uploaded = await uploadImage(imageFile)
        request.image_url = uploaded.data.url
      } else if (post.image_url) {
        request.image_url = post.image_url
      }

      await updatePost(postId, request)
      navigate(`/posts/${postId}`)
    } catch (error) {
      window.alert(getApiErrorMessage(error))
    }
  }

  if (!post) {
    return <main className="edit-post-page" />
  }

  return (
    <main className="edit-post-page">
      <h2 className="page-title">게시글 수정</h2>
      <PostForm
        key={post.id}
        mode="edit"
        initialTitle={post.title}
        initialContent={post.content}
        currentImageName={getFileNameFromUrl(post.image_url)}
        onSubmit={handleSubmit}
      />
    </main>
  )
}

export default EditPostPage
