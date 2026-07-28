function CommentForm({ content, isEditing, onChange, onSubmit }) {
  return (
    <section className="comment-write-section">
      <form id="comment-form" onSubmit={onSubmit}>
        <textarea
          id="comment-content"
          name="content"
          placeholder="댓글을 남겨주세요!"
          value={content}
          onChange={(event) => onChange(event.target.value)}
        />

        <button
          id="comment-submit-btn"
          type="submit"
          disabled={!content.trim()}
        >
          {isEditing ? '댓글 수정' : '댓글 등록'}
        </button>
      </form>
    </section>
  )
}

export default CommentForm
