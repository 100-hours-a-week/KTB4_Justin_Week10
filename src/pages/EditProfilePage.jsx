import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultProfileImage from '../assets/default-profile.svg'
import ConfirmModal from '../components/common/ConfirmModal.jsx'
import Toast from '../components/common/Toast.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useImagePreview } from '../hooks/useImagePreview.js'
import { uploadImage } from '../services/uploadApi.js'
import {
  deleteUser,
  getUser,
  updateUser,
} from '../services/userApi.js'
import {
  API_ERROR_CODE,
  getApiErrorMessage,
} from '../utils/apiError.js'

function getNicknameError(nickname) {
  if (!nickname.trim()) return '* 닉네임을 입력해주세요.'
  if (/\s/.test(nickname)) return '* 띄어쓰기를 없애주세요.'
  if (nickname.length > 10) {
    return '* 닉네임은 최대 10자까지 작성 가능합니다.'
  }

  return null
}

function EditProfilePage() {
  const navigate = useNavigate()
  const { user, logout, updateCurrentUser } = useAuth()
  const { imageFile, previewUrl, selectImage, clearImage } =
    useImagePreview()
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [helperText, setHelperText] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)
  const toastTimerRef = useRef(null)
  const nicknameError = getNicknameError(nickname)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUser(user.id)
        const userData = response.data

        setEmail(userData.email ?? '')
        setNickname(userData.nickname)
        setProfileImage(userData.profile_image ?? '')
      } catch (error) {
        window.alert(getApiErrorMessage(error))
      }
    }

    loadUser()
  }, [user.id])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const showToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }

    setIsToastVisible(true)
    toastTimerRef.current = window.setTimeout(() => {
      setIsToastVisible(false)
    }, 2000)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setHelperText(nicknameError ?? '')

    if (nicknameError) return

    try {
      let nextProfileImage = profileImage

      if (imageFile?.size > 0) {
        const uploaded = await uploadImage(imageFile)
        nextProfileImage = uploaded.data.url
      }

      const response = await updateUser(user.id, {
        nickname: nickname.trim(),
        profile_image: nextProfileImage,
      })
      const updatedUser = response.data

      setNickname(updatedUser.nickname)
      setProfileImage(updatedUser.profile_image ?? '')
      clearImage()
      updateCurrentUser(updatedUser)
      showToast()
    } catch (error) {
      if (error.message === API_ERROR_CODE.NICKNAME_ALREADY_EXISTS) {
        setHelperText(`* ${getApiErrorMessage(error)}`)
        return
      }

      window.alert(getApiErrorMessage(error))
    }
  }

  const handleDeleteUser = async () => {
    setIsDeleteModalOpen(false)

    try {
      await deleteUser(user.id)
      logout()
      navigate('/login')
    } catch (error) {
      window.alert(getApiErrorMessage(error))
    }
  }

  return (
    <main className="edit-profile-page">
      <h2>회원정보수정</h2>

      <form id="edit-profile-form" onSubmit={handleSubmit}>
        <label htmlFor="profile-image">프로필 사진*</label>

        <div className="profile-image-box">
          <img
            id="profile-preview"
            src={previewUrl || profileImage || defaultProfileImage}
            alt="프로필 이미지"
          />
          <label htmlFor="profile-image" className="profile-image-change-btn">
            변경
          </label>
          <input
            id="profile-image"
            name="profile_image"
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files[0]
              if (file) selectImage(file)
            }}
          />
        </div>

        <div className="form-group">
          <label>이메일</label>
          <p id="email">{email}</p>
        </div>

        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            maxLength="10"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            onBlur={() => setHelperText(nicknameError ?? '')}
          />
        </div>

        <p className="helper-text">{helperText}</p>

        <button id="submit-btn" type="submit" disabled={Boolean(nicknameError)}>
          수정하기
        </button>
      </form>

      <button
        id="delete-user-btn"
        type="button"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        회원 탈퇴
      </button>

      <Toast isVisible={isToastVisible} message="수정완료" />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="회원탈퇴 하시겠습니까?"
        description="작성된 게시글과 댓글은 알 수 없음으로 표시됩니다."
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </main>
  )
}

export default EditProfilePage
