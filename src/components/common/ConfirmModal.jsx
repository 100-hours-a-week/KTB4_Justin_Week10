import { useEffect, useRef } from 'react'

const DEFAULT_DESCRIPTION = '삭제한 내용은 복구 할 수 없습니다.'

function ConfirmModal({
  isOpen,
  title,
  description = DEFAULT_DESCRIPTION,
  onCancel,
  onConfirm,
}) {
  const confirmButtonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
    confirmButtonRef.current?.focus()

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="confirm-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <div className="confirm-modal__box" role="dialog" aria-modal="true">
        <h2 className="confirm-modal__title">{title}</h2>
        <p className="confirm-modal__desc">{description}</p>
        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__cancel"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className="confirm-modal__confirm"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
