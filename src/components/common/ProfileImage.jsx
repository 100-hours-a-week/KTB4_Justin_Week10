import { useEffect, useState } from 'react'
import defaultProfileImage from '../../assets/default-profile.png'

function ProfileImage({ src, alt = '프로필 이미지', onError, ...props }) {
  const [imageSrc, setImageSrc] = useState(src || defaultProfileImage)

  useEffect(() => {
    setImageSrc(src || defaultProfileImage)
  }, [src])

  const handleError = (event) => {
    if (imageSrc !== defaultProfileImage) {
      setImageSrc(defaultProfileImage)
    }

    onError?.(event)
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  )
}

export default ProfileImage
