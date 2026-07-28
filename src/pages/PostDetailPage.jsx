import { useCallback, useEffect, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import CommentForm from '../components/comment/CommentForm.jsx'
import CommentSection from '../components/comment/CommentSection.jsx'
import ConfirmModal from '../components/common/ConfirmModal.jsx'
import PostDetail from '../components/post/PostDetail.jsx'
import { useAuth } from '../hooks/useAuth.js'
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from '../services/commentApi.js'
import { deletePost, getPost } from '../services/postApi.js'
import { likePost, unlikePost } from '../services/postLikeApi.js'
import '../styles/post-detail.css'
import {
  API_ERROR_CODE,
  getApiErrorMessage,
} from '../utils/apiError.js'
import { sortByNewest } from '../utils/format.js'

function PostDetailPage() {
  const { postId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentContent, setCommentContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)

  const loadPost = useCallback(async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        getPost(postId),
        getComments(postId),
      ])

      setPost(postResponse.data)
      setComments(sortByNewest(commentsResponse.data))
    } catch (error) {
      if (error.message === API_ERROR_CODE.POST_NOT_FOUND) {
        window.alert(getApiErrorMessage(error))
        navigate('/posts', { replace: true })
        return
      }

      window.alert(getApiErrorMessage(error))
    }
  }, [navigate, postId])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  const navigateToLogin = () => {
    navigate('/login', {
      state: {
        from: location,
      },
    })
  }

  const requestLogin = () => {
    setConfirmModal({
      title: '로그인이 필요합니다.',
      description: '로그인하시겠습니까?',
      action: navigateToLogin,
    })
  }

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      requestLogin()
      return
    }

    try {
      if (post.liked === true) {
        await unlikePost(postId)
        setPost((currentPost) => ({
          ...currentPost,
          liked: false,
          like_count: (currentPost.like_count ?? 0) - 1,
        }))
      } else {
        await likePost(postId)
        setPost((currentPost) => ({
          ...currentPost,
          liked: true,
          like_count: (currentPost.like_count ?? 0) + 1,
        }))
      }
    } catch (error) {
      if (error.message === API_ERROR_CODE.ALREADY_LIKED) {
        setPost((currentPost) => ({ ...currentPost, liked: true }))
        return
      }

      if (error.message === API_ERROR_CODE.LIKE_NOT_FOUND) {
        setPost((currentPost) => ({ ...currentPost, liked: false }))
        return
      }

      window.alert(getApiErrorMessage(error))
      loadPost()
    }
  }

  const resetCommentForm = () => {
    setEditingCommentId(null)
    setCommentContent('')
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()

    const content = commentContent.trim()
    if (!content) return

    try {
      if (editingCommentId) {
        await updateComment(postId, editingCommentId, { content })
      } else {
        await createComment(postId, { content })
      }

      resetCommentForm()
      loadPost()
    } catch (error) {
      window.alert(getApiErrorMessage(error))

      if (error.message === API_ERROR_CODE.POST_NOT_FOUND) {
        navigate('/posts', { replace: true })
        return
      }

      if (error.message === API_ERROR_CODE.COMMENT_NOT_FOUND) {
        resetCommentForm()
        loadPost()
      }
    }
  }

  const handleCommentEdit = (comment) => {
    setEditingCommentId(comment.id)
    setCommentContent(comment.content)

    requestAnimationFrame(() => {
      document.querySelector('#comment-content')?.focus()
    })
  }

  const removeComment = async (commentId) => {
    try {
      await deleteComment(postId, commentId)
      loadPost()
    } catch (error) {
      window.alert(getApiErrorMessage(error))

      if (error.message === API_ERROR_CODE.COMMENT_NOT_FOUND) {
        loadPost()
      }
    }
  }

  const removePost = async () => {
    try {
      await deletePost(postId)
      navigate('/posts', { replace: true })
    } catch (error) {
      window.alert(getApiErrorMessage(error))

      if (error.message === API_ERROR_CODE.POST_NOT_FOUND) {
        navigate('/posts', { replace: true })
      }
    }
  }

  const handleConfirm = () => {
    const action = confirmModal?.action
    setConfirmModal(null)
    action?.()
  }

  if (!post) {
    return <main className="post-detail-page" />
  }

  return (
    <main className="post-detail-page">
      <button
        className="post-back-btn"
        type="button"
        aria-label="게시글 목록으로 돌아가기"
        onClick={() => navigate(-1)}
      >
        <span aria-hidden="true">←</span>
        <span>게시글 목록</span>
      </button>

      <PostDetail
        key={post.id}
        post={post}
        isOwner={Number(post.user_id) === Number(user?.id)}
        onEdit={() => navigate(`/posts/${postId}/edit`)}
        onDelete={() =>
          setConfirmModal({
            title: '게시글을 삭제하시겠습니까?',
            action: removePost,
          })
        }
        onToggleLike={handleToggleLike}
      />

      <CommentForm
        content={commentContent}
        isEditing={editingCommentId !== null}
        isAuthenticated={isAuthenticated}
        onChange={setCommentContent}
        onSubmit={handleCommentSubmit}
        onLoginRequired={requestLogin}
      />

      <CommentSection
        comments={comments}
        userId={user?.id}
        onEdit={handleCommentEdit}
        onDelete={(commentId) =>
          setConfirmModal({
            title: '댓글을 삭제하시겠습니까?',
            action: () => removeComment(commentId),
          })
        }
      />

      <ConfirmModal
        isOpen={confirmModal !== null}
        title={confirmModal?.title}
        description={confirmModal?.description}
        onCancel={() => setConfirmModal(null)}
        onConfirm={handleConfirm}
      />
    </main>
  )
}

export default PostDetailPage
