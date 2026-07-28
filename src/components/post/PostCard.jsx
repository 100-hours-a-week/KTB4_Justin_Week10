import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultProfileImage from '../../assets/default-profile.png'
import { formatCount } from '../../utils/format.js'

function parseTrackTitle(value) {
  const title = String(value ?? '').trim()
  const separatorIndex = title.indexOf('-')

  if (separatorIndex < 0) {
    return { artist: '', title }
  }

  return {
    artist: title.slice(0, separatorIndex).trim(),
    title: title.slice(separatorIndex + 1).trim(),
  }
}

function PostCard({ post }) {
  const navigate = useNavigate()
  const [hasThumbnail, setHasThumbnail] = useState(Boolean(post.image_url))
  const [profileImage, setProfileImage] = useState(
    post.author_profile_image || defaultProfileImage,
  )
  const track = parseTrackTitle(post.title)

  const handleProfileImageError = () => {
    if (profileImage !== defaultProfileImage) {
      setProfileImage(defaultProfileImage)
    }
  }

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
              alt={`${track.artist} - ${track.title} 앨범 이미지`}
              width="600"
              height="600"
              onError={() => setHasThumbnail(false)}
            />
          )}
          <div className="thumbnail-placeholder" aria-hidden="true">
            <span>#</span>
          </div>
          <div className="track-overlay">
            <span className="track-artist">{track.artist}</span>
            <strong className="track-title">{track.title}</strong>
          </div>
        </div>

        <div className="post-card-body">
          <div className="post-card-footer">
            <div className="post-author">
              <img
                className="author-profile-image"
                src={profileImage}
                alt={`${post.author} 프로필 이미지`}
                onError={handleProfileImageError}
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
