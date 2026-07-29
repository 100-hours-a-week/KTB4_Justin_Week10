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

const COMMENTS_PER_PAGE = 10

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
  const [commentPage, setCommentPage] = useState(1)

  // TODO: 서버 페이지네이션으로 전환하면 comments를 slice하지 않고,
  // API가 내려주는 현재 페이지 content와 totalPages를 사용한다.
  const commentTotalPages = Math.max(
    1,
    Math.ceil(comments.length / COMMENTS_PER_PAGE),
  )
  const currentCommentPage = Math.min(commentPage, commentTotalPages)
  const visibleComments = comments.slice(
    (currentCommentPage - 1) * COMMENTS_PER_PAGE,
    currentCommentPage * COMMENTS_PER_PAGE,
  )

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

  useEffect(() => {
    if (commentPage > commentTotalPages) {
      setCommentPage(commentTotalPages)
    }
  }, [commentPage, commentTotalPages])

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
      if (editingCommentId !== null) {
        await updateComment(postId, editingCommentId, { content })
      } else {
        await createComment(postId, { content })
        setCommentPage(1)
      }

      resetCommentForm()
      await loadPost()
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
      await loadPost()
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
        comments={visibleComments}
        userId={user?.id}
        onEdit={handleCommentEdit}
        onDelete={(commentId) =>
          setConfirmModal({
            title: '댓글을 삭제하시겠습니까?',
            action: () => removeComment(commentId),
          })
        }
      />

      {comments.length > COMMENTS_PER_PAGE && (
        <nav className="comment-pagination" aria-label="댓글 페이지">
          <button
            type="button"
            disabled={currentCommentPage === 1}
            onClick={() =>
              setCommentPage((page) => Math.max(1, page - 1))
            }
          >
            이전
          </button>
          <span>
            <strong>{currentCommentPage}</strong> / {commentTotalPages}
          </span>
          <button
            type="button"
            disabled={currentCommentPage === commentTotalPages}
            onClick={() =>
              setCommentPage((page) =>
                Math.min(commentTotalPages, page + 1),
              )
            }
          >
            다음
          </button>
        </nav>
      )}

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
