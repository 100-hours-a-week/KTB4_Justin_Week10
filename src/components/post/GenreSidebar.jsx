function GenreSidebar({ genres, selectedGenre, onGenreChange }) {
  const selectedIndex = Math.max(
    0,
    genres.findIndex((genre) => genre.code === selectedGenre) + 1,
  )

  return (
    <aside className="genre-sidebar" aria-label="장르 필터">
      <p className="genre-sidebar-title">장르</p>
      <div
        className="genre-tabs"
        style={{ '--selected-genre-index': selectedIndex }}
      >
        <span className="genre-tab-indicator" aria-hidden="true" />
        <button
          className={!selectedGenre ? 'active' : undefined}
          type="button"
          onClick={() => onGenreChange('')}
        >
          전체
        </button>
        {genres.map((genre) => (
          <button
            key={genre.code}
            className={selectedGenre === genre.code ? 'active' : undefined}
            type="button"
            onClick={() => onGenreChange(genre.code)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default GenreSidebar
