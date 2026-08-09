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
          <span className="sort-tab-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 7.5V12l3 2" />
            </svg>
          </span>
          최신 게시글
        </button>
        <button
          className={`sort-tab${activeFilter === 'popular' ? ' active' : ''}`}
          type="button"
          data-filter="popular"
          onClick={() => onFilterChange('popular')}
        >
          <span className="sort-tab-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13.2 3.5c.6 3-1.7 4.1-1.7 6.2 0 1.2.8 2 1.8 2.5-.1-1.7 1-2.8 2.1-3.8 1.8 1.7 3 3.7 3 6.2A6.4 6.4 0 0 1 12 21a6.4 6.4 0 0 1-6.4-6.4c0-3.4 2-6.2 4.8-8.4-.1 2.3.7 3.5 1.8 4.2-.4-2.8.2-5 1-6.9Z" />
            </svg>
          </span>
          인기 게시글
        </button>
        <button
          className={`sort-tab${activeFilter === 'liked' ? ' active' : ''}`}
          type="button"
          data-filter="liked"
          onClick={() => onFilterChange('liked')}
        >
          <span className="sort-tab-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20.5 9.2c0 5-8.5 10-8.5 10s-8.5-5-8.5-10A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8Z" />
            </svg>
          </span>
          좋아요 모아보기
        </button>
      </div>
    </section>
  )
}

export default PostSortTabs
