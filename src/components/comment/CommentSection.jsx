import CommentItem from './CommentItem.jsx'

function CommentSection({ comments, userId, onEdit, onDelete }) {
  return (
    <section className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={Number(comment.user_id) === Number(userId)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

export default CommentSection
