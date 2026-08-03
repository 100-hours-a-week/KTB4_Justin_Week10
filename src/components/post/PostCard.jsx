import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCount } from '../../utils/format.js'
import ProfileImage from '../common/ProfileImage.jsx'

function PostCard({ post }) {
  const navigate = useNavigate()
  const [hasThumbnail, setHasThumbnail] = useState(Boolean(post.image_url))

  return (
    <article className="post-card" data-post-id={post.id}>
      <button
        className="post-link"
        type="button"
        onClick={() => navigate(`/posts/${post.id}`)}
      >
        <div className="thumbnail-wrap">
          {hasThumbnail && (
            <img
              className="post-thumbnail"
              src={post.image_url}
              alt={`${post.artist} - ${post.track_title} 앨범 이미지`}
              width="600"
              height="600"
              onError={() => setHasThumbnail(false)}
            />
          )}
          <div className="thumbnail-placeholder" aria-hidden="true">
            <span>#</span>
          </div>
          <div className="track-overlay">
            <span className="track-artist">{post.artist}</span>
            <strong className="track-title">{post.track_title}</strong>
          </div>
        </div>

        <div className="post-card-body">
          <div className="post-card-footer">
            <div className="post-author">
              <ProfileImage
                className="author-profile-image"
                src={post.author_profile_image}
                alt={`${post.author} 프로필 이미지`}
              />
              <strong className="author">{post.author}</strong>
            </div>
            <div className="post-stats" aria-label="게시글 통계">
              <span
                className={`like-stat${post.liked === true ? ' liked' : ''}`}
                title="좋아요"
              >
                <i className="like-icon" aria-hidden="true">
                  {post.liked === true ? '♥' : '♡'}
                </i>
                <b className="like-count">{formatCount(post.like_count)}</b>
              </span>
              <span title="댓글">
                ○ <b className="comment-count">{formatCount(post.comment_count)}</b>
              </span>
            </div>
          </div>
        </div>
      </button>
    </article>
  )
}

export default PostCard
