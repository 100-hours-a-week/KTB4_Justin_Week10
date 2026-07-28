import { useState } from 'react'

function PostForm({
  initialTitle = '',
  initialContent = '',
  currentImageName,
  mode = 'create',
  onSubmit,
}) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [imageFile, setImageFile] = useState(null)
  const isValid = Boolean(title.trim() && content.trim())
  const isEdit = mode === 'edit'

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isValid) return

    onSubmit({
      title: title.trim(),
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
      <div className="form-group">
        <label htmlFor="title">제목*</label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength="26"
          placeholder="가수 - 제목 형태로 입력해주세요"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
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
        {isEdit ? '* helper text' : '* 제목, 내용을 모두 작성해주세요'}
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
