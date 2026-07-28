import { useEffect, useState } from 'react'
import PostCard from '../components/post/PostCard.jsx'
import PostSearchBar from '../components/post/PostSearchBar.jsx'
import PostSortTabs from '../components/post/PostSortTabs.jsx'
import { getPosts } from '../services/postApi.js'
import '../styles/posts.css'
import { sortByNewest } from '../utils/format.js'

function PostsPage() {
  const [posts, setPosts] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getPosts()
        const postItems = Array.isArray(response.data) ? response.data : []

        setPosts(sortByNewest(postItems))
        setHasLoaded(true)
      } catch {
      }
    }

    loadPosts()
  }, [])

  return (
    <main className="posts-page">
      <PostSearchBar />
      <PostSortTabs />

      <section className="post-list" aria-live="polite">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      {hasLoaded && posts.length === 0 && (
        <p className="post-empty">조건에 맞는 게시글이 없습니다.</p>
      )}
    </main>
  )
}

export default PostsPage
