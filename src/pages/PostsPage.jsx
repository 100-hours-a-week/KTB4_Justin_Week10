import { useEffect, useRef, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import PostCard from '../components/post/PostCard.jsx'
import ConfirmModal from '../components/common/ConfirmModal.jsx'
import PostSearchBar from '../components/post/PostSearchBar.jsx'
import PostSortTabs from '../components/post/PostSortTabs.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getLikedPosts, getPosts } from '../services/postApi.js'
import '../styles/posts.css'
import { sortByNewest } from '../utils/format.js'

const POSTS_PER_PAGE = 10

function renderPageSpacers(postCount) {
  if (postCount === 0) {
    return null
  }

  return Array.from(
    { length: Math.max(0, POSTS_PER_PAGE - postCount) },
    (_, index) => (
      <div
        key={`page-spacer-${index}`}
        className="post-card post-card-spacer"
        aria-hidden="true"
      >
        <div className="post-card-spacer-thumbnail" />
        <div className="post-card-spacer-body" />
      </div>
    ),
  )
}

function PostsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState(null)
  const [activeFilter, setActiveFilter] = useState('latest')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState('next')
  const [outgoingPosts, setOutgoingPosts] = useState(null)
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [transitionHeight, setTransitionHeight] = useState(null)
  const postListViewportRef = useRef(null)

  const pageParam = Number(searchParams.get('page'))
  const requestedPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  // TODO: 서버 페이지네이션으로 전환하면 전체 배열로 계산하지 않고
  // API 응답의 totalPages 값을 사용한다.
  const totalPages =
    posts === null ? 1 : Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(requestedPage, totalPages)

  // TODO: 서버 페이지네이션으로 전환하면 이 slice를 제거하고,
  // API가 현재 페이지에 맞춰 내려준 content를 그대로 렌더링한다.
  const visiblePosts =
    posts === null
      ? null
      : posts.slice(
          (currentPage - 1) * POSTS_PER_PAGE,
          currentPage * POSTS_PER_PAGE,
        )

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

  useEffect(() => {
    if (posts !== null && requestedPage > totalPages) {
      const nextSearchParams = new URLSearchParams(searchParams)
      nextSearchParams.set('page', String(totalPages))
      setSearchParams(nextSearchParams, { replace: true })
    }
  }, [posts, requestedPage, searchParams, setSearchParams, totalPages])

  useEffect(() => {
    if (!isPageTransitioning) {
      return undefined
    }

    const transitionTimer = window.setTimeout(() => {
      setIsPageTransitioning(false)
      setOutgoingPosts(null)
      setTransitionHeight(null)
    }, 720)

    return () => window.clearTimeout(transitionTimer)
  }, [isPageTransitioning])

  const changePage = (page, direction) => {
    if (isPageTransitioning) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('page', String(page))

    if (
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setSearchParams(nextSearchParams)
      return
    }

    setTransitionHeight(postListViewportRef.current?.offsetHeight ?? null)
    setOutgoingPosts(visiblePosts)
    setSlideDirection(direction)
    setIsPageTransitioning(true)
    setSearchParams(nextSearchParams)
  }

  const resetPage = () => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('page', '1')
    setSlideDirection('next')
    setSearchParams(nextSearchParams, { replace: true })
  }

  const loadLatestPosts = async () => {
    try {
      const response = await getPosts()
      const postItems = Array.isArray(response.data) ? response.data : []

      setPosts(sortByNewest(postItems))
      setActiveFilter('latest')
      resetPage()
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
      resetPage()
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
      resetPage()
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

  const handlePreviousPage = () => {
    const previousPage = currentPage === 1 ? totalPages : currentPage - 1
    changePage(previousPage, 'previous')
  }

  const handleNextPage = () => {
    const nextPage = currentPage === totalPages ? 1 : currentPage + 1
    changePage(nextPage, 'next')
  }

  useEffect(() => {
    const viewport = postListViewportRef.current

    if (!viewport || totalPages <= 1) {
      return undefined
    }

    const handleWheel = (event) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY

      if (Math.abs(delta) < 12) {
        return
      }

      event.preventDefault()

      if (isPageTransitioning) {
        return
      }

      if (delta > 0) {
        handleNextPage()
      } else {
        handlePreviousPage()
      }
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      viewport.removeEventListener('wheel', handleWheel)
    }
  })

  return (
    <main className="posts-page">
      <PostSearchBar />
      <PostSortTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {visiblePosts !== null && (
        <div
          ref={postListViewportRef}
          className={`post-list-viewport slide-${slideDirection} ${
            isPageTransitioning ? 'is-transitioning' : ''
          }`}
          style={
            isPageTransitioning && transitionHeight !== null
              ? { height: `${transitionHeight}px` }
              : undefined
          }
        >
          {isPageTransitioning && outgoingPosts !== null && (
            <section
              className="post-list post-list-outgoing"
              aria-hidden="true"
            >
              {outgoingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {renderPageSpacers(outgoingPosts.length)}
            </section>
          )}

          <section
            key={`${activeFilter}-${currentPage}`}
            className="post-list post-list-current"
            aria-live="polite"
          >
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {renderPageSpacers(visiblePosts.length)}
          </section>
        </div>
      )}

      {posts !== null && posts.length === 0 && (
        <p className="post-empty">조건에 맞는 게시글이 없습니다.</p>
      )}

      {posts !== null && posts.length > 0 && totalPages > 1 && (
        <nav className="post-pagination" aria-label="게시글 페이지">
          <button type="button" onClick={handlePreviousPage}>
            이전
          </button>
          <span>
            <strong>{currentPage}</strong> / {totalPages}
          </span>
          <button type="button" onClick={handleNextPage}>
            다음
          </button>
        </nav>
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
