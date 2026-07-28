function CommentForm({
  content,
  isEditing,
  isAuthenticated,
  onChange,
  onSubmit,
  onLoginRequired,
}) {
  return (
    <section className="comment-write-section">
      <form id="comment-form" onSubmit={onSubmit}>
        <textarea
          id="comment-content"
          name="content"
          placeholder={
            isAuthenticated
              ? '댓글을 남겨주세요!'
              : '로그인 후 댓글을 작성할 수 있습니다.'
          }
          readOnly={!isAuthenticated}
          value={content}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => {
            if (!isAuthenticated) {
              onLoginRequired()
            }
          }}
        />

        <button
          id="comment-submit-btn"
          type="submit"
          disabled={!content.trim()}
          onClick={(event) => {
            if (!isAuthenticated) {
              event.preventDefault()
              onLoginRequired()
            }
          }}
        >
          {isEditing ? '댓글 수정' : '댓글 등록'}
        </button>
      </form>
    </section>
  )
}

export default CommentForm
