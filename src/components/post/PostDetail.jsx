import { useState } from 'react'
import { formatCount, formatDate } from '../../utils/format.js'

function PostDetail({
  post,
  isOwner,
  onEdit,
  onDelete,
  onToggleLike,
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(post.image_url) && !imageFailed

  return (
    <article className="post-detail">
      <section className="post-header">
        <h2 className="post-title">{post.title}</h2>

        <div className="post-meta-row">
          <div className="author-info">
            <img
              className="author-profile-image"
              src={post.author_profile_image ?? undefined}
              alt="작성자 프로필 이미지"
            />
            <strong className="author">{post.author}</strong>
            <time className="post-created-at">
              {formatDate(post.created_at)}
            </time>
          </div>

          {isOwner && (
            <div className="post-action-buttons">
              <button type="button" onClick={onEdit}>
                수정
              </button>
              <button type="button" onClick={onDelete}>
                삭제
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="post-body">
        {showImage && (
          <img
            className="post-image"
            src={post.image_url}
            alt="게시글 이미지"
            onError={() => setImageFailed(true)}
          />
        )}
        {!showImage && (
          <div
            className="post-image-placeholder"
            aria-label="등록된 게시글 이미지 없음"
          >
            #
          </div>
        )}
        <p className="post-content">{post.content}</p>
      </section>

      <section className="post-stats">
        <button
          className={`stat-box${post.liked === true ? ' liked' : ''}`}
          type="button"
          onClick={onToggleLike}
        >
          <strong>{formatCount(post.like_count)}</strong>
          <span>좋아요수</span>
        </button>

        <div className="stat-box">
          <strong>{formatCount(post.view_count)}</strong>
          <span>조회수</span>
        </div>

        <div className="stat-box">
          <strong>{formatCount(post.comment_count)}</strong>
          <span>댓글</span>
        </div>
      </section>
    </article>
  )
}

export default PostDetail
