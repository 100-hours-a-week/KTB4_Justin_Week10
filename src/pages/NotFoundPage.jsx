import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="migration-placeholder">
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Link to="/posts">게시글 목록으로 이동</Link>
    </main>
  )
}

export default NotFoundPage
