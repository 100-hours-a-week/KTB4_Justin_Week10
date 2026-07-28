import { useCallback, useEffect, useRef, useState } from 'react'

export function useImagePreview() {
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const objectUrlRef = useRef(null)

  const clearImage = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    setImageFile(null)
    setPreviewUrl(null)
  }, [])

  const selectImage = useCallback((file) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    objectUrlRef.current = objectUrl
    setImageFile(file)
    setPreviewUrl(objectUrl)
  }, [])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  return {
    imageFile,
    previewUrl,
    selectImage,
    clearImage,
  }
}
