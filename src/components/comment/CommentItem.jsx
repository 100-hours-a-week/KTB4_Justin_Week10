import { formatDate } from '../../utils/format.js'

function CommentItem({ comment, isOwner, onEdit, onDelete }) {
  return (
    <article className="comment-item" data-comment-id={comment.id}>
      <div className="comment-meta-row">
        <div className="comment-author-info">
          <img
            className="comment-author-profile-image"
            src={comment.author_profile_image ?? undefined}
            alt="댓글 작성자 프로필 이미지"
          />
          <strong className="comment-author">{comment.author}</strong>
          <time className="comment-created-at">
            {formatDate(comment.created_at)}
          </time>
        </div>

        {isOwner && (
          <div className="comment-action-buttons">
            <button
              className="comment-edit-btn"
              type="button"
              onClick={() => onEdit(comment)}
            >
              수정
            </button>
            <button
              className="comment-delete-btn"
              type="button"
              onClick={() => onDelete(comment.id)}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <p className="comment-content">{comment.content}</p>
    </article>
  )
}

export default CommentItem
