function PostSortTabs() {
  return (
    <section className="list-toolbar" aria-label="게시글 정렬">
      <div className="sort-tabs" role="group" aria-label="정렬 기준">
        <button
          className="sort-tab active"
          type="button"
          data-filter="latest"
        >
          <span aria-hidden="true">◷</span> 최신 게시글
        </button>
        <button className="sort-tab" type="button" data-filter="popular">
          <span aria-hidden="true">♨</span> 인기 게시글
        </button>
        <button className="sort-tab" type="button" data-filter="liked">
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
