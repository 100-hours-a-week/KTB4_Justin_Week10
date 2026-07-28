function PostSortTabs({
  activeFilter,
  onFilterChange,
}) {
  return (
    <section className="list-toolbar" aria-label="게시글 정렬">
      <div className="sort-tabs" role="group" aria-label="정렬 기준">
        <button
          className={`sort-tab${activeFilter === 'latest' ? ' active' : ''}`}
          type="button"
          data-filter="latest"
          onClick={() => onFilterChange('latest')}
        >
          <span aria-hidden="true">◷</span> 최신 게시글
        </button>
        <button
          className={`sort-tab${activeFilter === 'popular' ? ' active' : ''}`}
          type="button"
          data-filter="popular"
          onClick={() => onFilterChange('popular')}
        >
          <span aria-hidden="true">♨</span> 인기 게시글
        </button>
        <button
          className={`sort-tab${activeFilter === 'liked' ? ' active' : ''}`}
          type="button"
          data-filter="liked"
          onClick={() => onFilterChange('liked')}
        >
          <span aria-hidden="true">♡</span> 좋아요 모아보기
        </button>
      </div>
      <span className="category-label">
        전체 게시글 <span aria-hidden="true">⌄</span>
      </span>
    </section>
  )
}

export default PostSortTabs
