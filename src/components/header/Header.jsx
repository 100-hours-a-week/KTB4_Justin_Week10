import { useEffect, useRef, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { logout as logoutRequest } from '../../services/authApi.js'
import ProfileImage from '../common/ProfileImage.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'

function Header() {
  const { authStatus, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const headerRef = useRef(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)

  const { pathname } = location
  const isLoginPage = pathname === '/login'
  const isSignupPage = pathname === '/signup'
  const isAuthPage = isLoginPage || isSignupPage
  const isPostsRoute = pathname === '/posts' || pathname.startsWith('/posts/')
  const showBackButton =
    isSignupPage ||
    pathname === '/posts/new' ||
    /^\/posts\/[^/]+\/edit$/.test(pathname)

  useEffect(() => {
    setIsProfileOpen(false)
    setIsSearchActive(false)
  }, [pathname])

  useEffect(() => {
    if (!isPostsRoute) return undefined

    const searchInput = document.querySelector('#post-search')

    if (!searchInput) return undefined

    const activateSearchTab = () => setIsSearchActive(true)
    const activatePostsTab = () => setIsSearchActive(false)

    searchInput.addEventListener('focus', activateSearchTab)
    searchInput.addEventListener('blur', activatePostsTab)

    return () => {
      searchInput.removeEventListener('focus', activateSearchTab)
      searchInput.removeEventListener('blur', activatePostsTab)
    }
  }, [isPostsRoute])

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
      className={`header posts-header${isAuthPage ? ' auth-header' : ''}`}
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
            className={`nav-posts${isPostsRoute && !isSearchActive ? ' active' : ''}`}
            to="/posts"
            onClick={() => setIsSearchActive(false)}
          >
            게시글
          </Link>
          <button
            className={isSearchActive ? 'nav-search active' : 'nav-search'}
            type="button"
            onClick={handleSearch}
          >
            검색
          </button>
        </nav>

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
