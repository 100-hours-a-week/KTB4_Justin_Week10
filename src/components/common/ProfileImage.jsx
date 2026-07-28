import defaultProfileImage from '../../assets/default-profile.png'

function ProfileImage({ src, alt = '프로필 이미지', ...props }) {
  return (
    <img
      src={src || defaultProfileImage}
      alt={alt}
      {...props}
    />
  )
}

export default ProfileImage
