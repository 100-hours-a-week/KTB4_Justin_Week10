import { useNavigate } from 'react-router-dom'
import PostForm from '../components/post/PostForm.jsx'
import { createPost } from '../services/postApi.js'
import { uploadImage } from '../services/uploadApi.js'
import { getApiErrorMessage } from '../utils/apiError.js'

function CreatePostPage() {
  const navigate = useNavigate()

  const handleSubmit = async ({ title, content, imageFile }) => {
    const request = { title, content }

    try {
      if (imageFile) {
        const uploaded = await uploadImage(imageFile)
        request.image_url = uploaded.data.url
      }

      await createPost(request)
      navigate('/posts')
    } catch (error) {
      window.alert(getApiErrorMessage(error))
    }
  }

  return (
    <main className="make-post-page">
      <h2 className="page-title">게시글 작성</h2>
      <PostForm onSubmit={handleSubmit} />
    </main>
  )
}

export default CreatePostPage
