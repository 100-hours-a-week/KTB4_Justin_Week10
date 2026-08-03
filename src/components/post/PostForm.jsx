import { useEffect, useState } from 'react'
import { getGenres } from '../../services/genreApi.js'

function PostForm({
  initialTrackTitle = '',
  initialArtist = '',
  initialGenre = '',
  initialContent = '',
  currentImageName,
  mode = 'create',
  onSubmit,
}) {
  const [trackTitle, setTrackTitle] = useState(initialTrackTitle)
  const [artist, setArtist] = useState(initialArtist)
  const [genre, setGenre] = useState(initialGenre)
  const [genres, setGenres] = useState([])
  const [genreLoadFailed, setGenreLoadFailed] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [imageFile, setImageFile] = useState(null)
  const isValid = Boolean(
    trackTitle.trim() && artist.trim() && genre && content.trim(),
  )
  const isEdit = mode === 'edit'

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await getGenres()
        setGenres(response.data)
      } catch {
        setGenreLoadFailed(true)
      }
    }

    loadGenres()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isValid) return

    onSubmit({
      trackTitle: trackTitle.trim(),
      artist: artist.trim(),
      genre,
      content: content.trim(),
      imageFile,
    })
  }

  return (
    <form
      id={isEdit ? 'edit-post-form' : 'post-form'}
      className="post-form"
      onSubmit={handleSubmit}
    >
      <div className="post-track-fields">
        <div className="form-group">
          <label htmlFor="track-title">제목*</label>
          <input
            id="track-title"
            name="track-title"
            type="text"
            maxLength="200"
            placeholder="곡 제목"
            required
            value={trackTitle}
            onChange={(event) => setTrackTitle(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="artist">가수*</label>
          <input
            id="artist"
            name="artist"
            type="text"
            maxLength="100"
            placeholder="가수 또는 팀명"
            required
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
          />
        </div>

        <div className="form-group genre-form-group">
          <label htmlFor="genre">장르*</label>
          <select
            id="genre"
            name="genre"
            required
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          >
            <option value="" disabled>
              {genreLoadFailed ? '불러오기 실패' : '장르 선택'}
            </option>
            {genres.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="content">내용*</label>
        <textarea
          id="content"
          name="content"
          placeholder={isEdit ? undefined : '감상평을 작성해주세요.'}
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>

      <p className="helper-text">
        {genreLoadFailed
          ? '* 장르 목록을 불러오지 못했습니다.'
          : '* 곡 제목, 가수, 장르, 내용을 모두 작성해주세요'}
      </p>

      <div className="form-group image-group">
        <label htmlFor="image">이미지 (1개)</label>

        <div className={isEdit ? 'file-row' : undefined}>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setImageFile(event.target.files[0] ?? null)
            }}
          />

          {isEdit && (
            <span className="current-file-name">
              {imageFile?.name ?? currentImageName ?? '없음'}
            </span>
          )}
        </div>
      </div>

      <button className="submit-btn" type="submit" disabled={!isValid}>
        {isEdit ? '수정하기' : '완료'}
      </button>
    </form>
  )
}

export default PostForm
