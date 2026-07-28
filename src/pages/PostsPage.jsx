import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/post/PostCard.jsx'
import ConfirmModal from '../components/common/ConfirmModal.jsx'
import PostSearchBar from '../components/post/PostSearchBar.jsx'
import PostSortTabs from '../components/post/PostSortTabs.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getLikedPosts, getPosts } from '../services/postApi.js'
import '../styles/posts.css'
import { sortByNewest } from '../utils/format.js'

function PostsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState(null)
  const [activeFilter, setActiveFilter] = useState('latest')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getPosts()
        const postItems = Array.isArray(response.data) ? response.data : []

        setPosts(sortByNewest(postItems))
      } catch {
      }
    }

    loadPosts()
  }, [])

  const loadLatestPosts = async () => {
    try {
      const response = await getPosts()
      const postItems = Array.isArray(response.data) ? response.data : []

      setPosts(sortByNewest(postItems))
      setActiveFilter('latest')
    } catch {
    }
  }

  const loadLikedPosts = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }

    try {
      const response = await getLikedPosts()
      const postItems = Array.isArray(response.data) ? response.data : []

      setPosts(postItems)
      setActiveFilter('liked')
    } catch {
    }
  }

  const loadPopularPosts = async () => {
    try {
      const response = await getPosts()
      const postItems = Array.isArray(response.data) ? response.data : []

      setPosts(
        [...postItems].sort(
          (a, b) => (b.like_count ?? 0) - (a.like_count ?? 0),
        ),
      )
      setActiveFilter('popular')
    } catch {
    }
  }

  const handleFilterChange = (filter) => {
    if (filter === 'latest') {
      loadLatestPosts()
      return
    }

    if (filter === 'popular') {
      loadPopularPosts()
      return
    }

    if (filter === 'liked') {
      loadLikedPosts()
    }
  }

  const navigateToLogin = () => {
    setIsLoginModalOpen(false)
    navigate('/login', {
      state: {
        from: location,
      },
    })
  }

  return (
    <main className="posts-page">
      <PostSearchBar />
      <PostSortTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {posts !== null && (
        <section className="post-list" aria-live="polite">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}

      {posts !== null && posts.length === 0 && (
        <p className="post-empty">조건에 맞는 게시글이 없습니다.</p>
      )}

      <ConfirmModal
        isOpen={isLoginModalOpen}
        title="로그인이 필요합니다."
        description="로그인하시겠습니까?"
        onCancel={() => setIsLoginModalOpen(false)}
        onConfirm={navigateToLogin}
      />
    </main>
  )
}

export default PostsPage
