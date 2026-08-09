function PostSearchBar({
  value,
  errorMessage,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
}) {
  return (
    <form
      className="search-section"
      role="search"
      aria-label="게시글 검색"
      onSubmit={onSubmit}
    >
      <label className="search-box" htmlFor="post-search">
        <span aria-hidden="true">⌕</span>
        <input
          id="post-search"
          type="search"
          value={value}
          placeholder="곡명, 가수, 작성자로 검색해보세요"
          autoComplete="off"
          maxLength={50}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? 'post-search-error' : undefined}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </label>
      {errorMessage && (
        <p id="post-search-error" className="search-error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}

export default PostSearchBar
