function PostSearchBar({
  value,
  errorMessage,
  suggestions,
  suggestionStatus,
  onChange,
  onSubmit,
  onSuggestionSelect,
  onFocus,
  onBlur,
}) {
  const isSuggestionOpen = suggestionStatus !== 'idle'

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
          aria-autocomplete="list"
          aria-controls="post-search-suggestions"
          aria-expanded={isSuggestionOpen}
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
      {isSuggestionOpen && (
        <div
          id="post-search-suggestions"
          className="search-suggestions"
          role="listbox"
          aria-label="게시글 검색 자동완성"
        >
          {suggestionStatus === 'loading' && (
            <p className="search-suggestion-status">검색 중...</p>
          )}

          {suggestionStatus === 'error' && (
            <p className="search-suggestion-status is-error">
              추천 결과를 불러오지 못했습니다.
            </p>
          )}

          {suggestionStatus === 'success' && suggestions.length === 0 && (
            <p className="search-suggestion-status">추천 결과가 없습니다.</p>
          )}

          {suggestionStatus === 'success' &&
            suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="search-suggestion-item"
                type="button"
                role="option"
                aria-selected="false"
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => onSuggestionSelect(suggestion.id)}
              >
                <span className="search-suggestion-track">
                  {suggestion.track_title}
                  <span aria-hidden="true"> – </span>
                  {suggestion.artist}
                </span>
                <span className="search-suggestion-author">
                  작성자 {suggestion.author}
                </span>
              </button>
            ))}
        </div>
      )}
    </form>
  )
}

export default PostSearchBar
