import { Link } from 'react-router-dom'

function ProfileDropdown({ isOpen, onClose, onLogout }) {
  return (
    <nav
      className={`profile-dropdown${isOpen ? ' open' : ''}`}
      aria-label="프로필 메뉴"
    >
      <Link to="/profile/edit" onClick={onClose}>
        회원정보수정
      </Link>
      <Link to="/password/edit" onClick={onClose}>
        비밀번호수정
      </Link>
      <button type="button" onClick={onLogout}>
        로그아웃
      </button>
    </nav>
  )
}

export default ProfileDropdown
