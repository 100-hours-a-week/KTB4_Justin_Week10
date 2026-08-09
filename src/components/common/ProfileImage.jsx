import { useEffect, useState } from 'react'
import defaultProfileImage from '../../assets/default-profile.svg'

const LEGACY_WITHDRAWN_PROFILE_IMAGE = 'https://image.kr/withdrawn.jpg'

function resolveProfileImage(src) {
  return !src || src === LEGACY_WITHDRAWN_PROFILE_IMAGE
    ? defaultProfileImage
    : src
}

function ProfileImage({ src, alt = '프로필 이미지', onError, ...props }) {
  const [imageSrc, setImageSrc] = useState(resolveProfileImage(src))

  useEffect(() => {
    setImageSrc(resolveProfileImage(src))
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
