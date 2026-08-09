import { useEffect, useRef, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { logout as logoutRequest } from '../../services/authApi.js'
import { getPostSuggestions } from '../../services/postApi.js'
import ProfileImage from '../common/ProfileImage.jsx'
import PostSearchBar from '../post/PostSearchBar.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'

function Header() {
  const { authStatus, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const headerRef = useRef(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const appliedKeyword = searchParams.get('keyword') ?? ''
  const [draftKeyword, setDraftKeyword] = useState(appliedKeyword)
  const [searchError, setSearchError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [suggestionStatus, setSuggestionStatus] = useState('idle')

  const { pathname } = location
  const isLoginPage = pathname === '/login'
  const isSignupPage = pathname === '/signup'
  const isAuthPage = isLoginPage || isSignupPage
  const isPostsRoute = pathname === '/posts' || pathname.startsWith('/posts/')
  const isPostsPage = pathname === '/posts'
  const hasAppliedSearch = Boolean(appliedKeyword)
  const showBackButton =
    isSignupPage ||
    pathname === '/posts/new' ||
    /^\/posts\/[^/]+\/edit$/.test(pathname)

  useEffect(() => {
    setIsProfileOpen(false)
    setIsSearchActive(false)
  }, [pathname])

  useEffect(() => {
    if (appliedKeyword) {
      setDraftKeyword(appliedKeyword)
    }
    setSearchError('')
  }, [appliedKeyword])

  useEffect(() => {
    const normalizedKeyword = draftKeyword.trim()

    if (!isPostsPage || !isSearchActive || normalizedKeyword.length < 2) {
      setSuggestions([])
      setSuggestionStatus('idle')
      return undefined
    }

    let cancelled = false
    const debounceTimer = window.setTimeout(async () => {
      setSuggestionStatus('loading')

      try {
        const response = await getPostSuggestions({
          keyword: normalizedKeyword,
          size: 5,
        })

        if (!cancelled) {
          setSuggestions(Array.isArray(response.data) ? response.data : [])
          setSuggestionStatus('success')
        }
      } catch {
        if (!cancelled) {
          setSuggestions([])
          setSuggestionStatus('error')
        }
      }
    }, 300)

    return () => {
      cancelled = true
      window.clearTimeout(debounceTimer)
    }
  }, [draftKeyword, isPostsPage, isSearchActive])

  useEffect(() => {
    if (!isProfileOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isProfileOpen])

  const handleSearch = () => {
    const searchInput = document.querySelector('#post-search')

    if (!searchInput) return

    setIsSearchActive(true)
    searchInput.focus({ preventScroll: true })
  }

  const handleSearchInputChange = (keyword) => {
    setDraftKeyword(keyword)
    setSearchError('')
    setSuggestions([])
    setSuggestionStatus('idle')
    setIsSearchActive(true)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const normalizedKeyword = draftKeyword.trim()

    if (normalizedKeyword.length < 2) {
      setDraftKeyword('')
      setSearchError('검색어를 2글자 이상 입력해주세요.')
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('keyword', normalizedKeyword)
    nextSearchParams.set('page', '1')
    setDraftKeyword(normalizedKeyword)
    setSearchError('')
    setSuggestions([])
    setSuggestionStatus('idle')
    setIsSearchActive(false)
    setSearchParams(nextSearchParams)
  }

  const handleSuggestionSelect = (postId) => {
    setSuggestions([])
    setSuggestionStatus('idle')
    setIsSearchActive(false)
    navigate(`/posts/${postId}`)
  }

  const handlePostsClick = (event) => {
    setIsSearchActive(false)
    setSearchError('')
    setSuggestions([])
    setSuggestionStatus('idle')

    if (!isPostsPage) {
      return
    }

    event.preventDefault()

    if (!hasAppliedSearch) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.delete('keyword')
    nextSearchParams.set('page', '1')
    setSearchParams(nextSearchParams)
  }

  const handleLogout = async () => {
    setIsProfileOpen(false)

    try {
      await logoutRequest()
    } catch {
    } finally {
      logout()
      navigate('/posts')
    }
  }

  return (
    <header
      ref={headerRef}
      className={`header posts-header${isAuthPage ? ' auth-header' : ''}${isPostsPage ? ' has-search' : ''}`}
    >
      <div className="header-inner">
        {showBackButton && (
          <button
            className="header-back-btn"
            type="button"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
        )}

        <Link
          className="brand header-title"
          to="/posts"
          aria-label="TuneLog 게시글 홈"
        >
          <span className="brand-mark" aria-hidden="true">
            ♯
          </span>
          <span>TuneLog</span>
        </Link>

        <nav className="main-nav" aria-label="주요 메뉴">
          <Link
            className={`nav-posts${
              isPostsRoute && !isSearchActive && !hasAppliedSearch
                ? ' active'
                : ''
            }`}
            to="/posts"
            onClick={handlePostsClick}
          >
            게시글
          </Link>
          <button
            className={
              isSearchActive || hasAppliedSearch
                ? 'nav-search active'
                : 'nav-search'
            }
            type="button"
            onClick={handleSearch}
          >
            검색
          </button>
        </nav>

        {isPostsPage && (
          <div className="header-search">
            <PostSearchBar
              value={draftKeyword}
              errorMessage={searchError}
              suggestions={suggestions}
              suggestionStatus={suggestionStatus}
              onChange={handleSearchInputChange}
              onSubmit={handleSearchSubmit}
              onSuggestionSelect={handleSuggestionSelect}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
            />
          </div>
        )}

        <div className="header-actions">
          {isAuthPage ? (
            <Link
              className="header-login-link"
              to={isLoginPage ? '/signup' : '/login'}
            >
              {isLoginPage ? '회원가입하기' : '로그인하기'}
            </Link>
          ) : (
            <>
              {authStatus === 'guest' && (
                <Link className="header-login-link" to="/login">
                  로그인하기
                </Link>
              )}

              {authStatus === 'authenticated' && (
                <>
                  <Link className="header-write-btn" to="/posts/new">
                    글 작성하기
                  </Link>
                  <button
                    className="profile-menu-btn"
                    type="button"
                    aria-label="프로필 메뉴 열기"
                    aria-expanded={isProfileOpen}
                    onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
                  >
                    <ProfileImage
                      src={user?.profile_image}
                      alt="프로필 이미지"
                    />
                    <span className="header-nickname">{user?.nickname}</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {!isAuthPage && authStatus === 'authenticated' && (
          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  )
}

export default Header
