import { useEffect, useRef, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import PostCard from '../components/post/PostCard.jsx'
import ConfirmModal from '../components/common/ConfirmModal.jsx'
import PostSortTabs from '../components/post/PostSortTabs.jsx'
import GenreSidebar from '../components/post/GenreSidebar.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getLikedPosts, getPosts } from '../services/postApi.js'
import { getGenres } from '../services/genreApi.js'
import '../styles/posts.css'

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
  const [pageMeta, setPageMeta] = useState({
    total_pages: 0,
    total_elements: 0,
  })
  const [genres, setGenres] = useState([])
  const [activeFilter, setActiveFilter] = useState('latest')
  const [isListLoading, setIsListLoading] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState('next')
  const [outgoingPosts, setOutgoingPosts] = useState(null)
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [transitionHeight, setTransitionHeight] = useState(null)
  const postListViewportRef = useRef(null)
  const pendingTransitionRef = useRef(false)

  const pageParam = Number(searchParams.get('page'))
  const requestedPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
  const selectedGenre = searchParams.get('genre') ?? ''
  const appliedKeyword = searchParams.get('keyword') ?? ''
  const totalPages = Math.max(1, pageMeta.total_pages)
  const currentPage = Math.min(requestedPage, totalPages)
  const visiblePosts = posts

  useEffect(() => {
    let cancelled = false

    const loadPostPage = async () => {
      setIsListLoading(true)

      try {
        const pageOptions = {
          page: requestedPage - 1,
          size: POSTS_PER_PAGE,
          genre: selectedGenre,
          keyword: appliedKeyword,
        }
        const response =
          activeFilter === 'liked'
            ? await getLikedPosts(pageOptions)
            : await getPosts({ ...pageOptions, sort: activeFilter })
        const nextPage = response.data ?? {}

        if (cancelled) {
          return
        }

        setPosts(Array.isArray(nextPage.content) ? nextPage.content : [])
        setPageMeta({
          total_pages: nextPage.total_pages ?? 0,
          total_elements: nextPage.total_elements ?? 0,
        })

        if (pendingTransitionRef.current) {
          pendingTransitionRef.current = false
          setIsPageTransitioning(true)
        }
      } catch {
        if (!cancelled) {
          pendingTransitionRef.current = false
          setPosts([])
          setPageMeta({ total_pages: 0, total_elements: 0 })
        }
      } finally {
        if (!cancelled) {
          setIsListLoading(false)
        }
      }
    }

    loadPostPage()

    return () => {
      cancelled = true
    }
  }, [activeFilter, appliedKeyword, requestedPage, selectedGenre])

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await getGenres()
        setGenres(Array.isArray(response.data) ? response.data : [])
      } catch {
        setGenres([])
      }
    }

    loadGenres()
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

  const prepareListTransition = (direction) => {
    if (
      posts === null ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      pendingTransitionRef.current = false
      return
    }

    setTransitionHeight(postListViewportRef.current?.offsetHeight ?? null)
    setOutgoingPosts(posts)
    setSlideDirection(direction)
    pendingTransitionRef.current = true
  }

  const changePage = (page, direction) => {
    if (isPageTransitioning || isListLoading) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('page', String(page))

    prepareListTransition(direction)
    setSearchParams(nextSearchParams)
  }

  const resetPage = () => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('page', '1')
    setSearchParams(nextSearchParams, { replace: true })
  }

  const handleGenreChange = (genre) => {
    if (genre === selectedGenre || isPageTransitioning || isListLoading) {
      return
    }

    const currentIndex = Math.max(
      0,
      genres.findIndex((item) => item.code === selectedGenre) + 1,
    )
    const nextIndex = Math.max(
      0,
      genres.findIndex((item) => item.code === genre) + 1,
    )
    const nextSearchParams = new URLSearchParams(searchParams)

    if (genre) {
      nextSearchParams.set('genre', genre)
    } else {
      nextSearchParams.delete('genre')
    }

    prepareListTransition(nextIndex >= currentIndex ? 'next' : 'previous')
    nextSearchParams.set('page', '1')
    setSearchParams(nextSearchParams, { replace: true })
  }

  const handleFilterChange = (filter) => {
    if (filter === activeFilter || isPageTransitioning || isListLoading) {
      return
    }

    if (filter === 'liked' && !isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }

    const filterOrder = ['latest', 'popular', 'liked']
    prepareListTransition(
      filterOrder.indexOf(filter) >= filterOrder.indexOf(activeFilter)
        ? 'next'
        : 'previous',
    )
    setActiveFilter(filter)
    resetPage()
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
      <PostSortTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      <div className="posts-content-layout">
        <GenreSidebar
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
        />

        <div className="posts-results">
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
                key={`${activeFilter}-${selectedGenre}-${appliedKeyword}-${currentPage}`}
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

          {posts !== null && posts.length === 0 && !isListLoading && (
            <p className="post-empty">조건에 맞는 게시글이 없습니다.</p>
          )}

          {pageMeta.total_elements > 0 && totalPages > 1 && (
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
        </div>
      </div>

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
