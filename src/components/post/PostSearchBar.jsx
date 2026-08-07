function PostSearchBar({ onFocus, onBlur }) {
  return (
    <section className="search-section" aria-label="게시글 검색">
      <label className="search-box" htmlFor="post-search">
        <span aria-hidden="true">⌕</span>
        <input
          id="post-search"
          type="search"
          placeholder="제목, 내용, 작성자로 검색해보세요"
          autoComplete="off"
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </label>
    </section>
  )
}

export default PostSearchBar
