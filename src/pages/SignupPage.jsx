import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useImagePreview } from '../hooks/useImagePreview.js'
import { signup } from '../services/authApi.js'
import { uploadImage } from '../services/uploadApi.js'
import {
  API_ERROR_CODE,
  getApiErrorMessage,
} from '../utils/apiError.js'
import {
  isValidEmail,
  isValidPassword,
} from '../utils/validation.js'

const DEFAULT_HELPERS = {
  profile: '* 프로필 사진을 추가해주세요.',
  email: '* 이메일을 입력해주세요.',
  password: '* 비밀번호를 입력해주세요.',
  passwordCheck: '* 비밀번호를 한번더 입력해주세요.',
  nickname: '* 닉네임을 입력해주세요.',
}

function getEmailError(email) {
  if (!email.trim()) return '*이메일을 입력해주세요.'
  if (!isValidEmail(email.trim())) {
    return '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)'
  }

  return null
}

function getPasswordError(password, passwordCheck) {
  if (!password) return '*비밀번호를 입력해주세요'
  if (!isValidPassword(password)) {
    return '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
  }
  if (passwordCheck && password !== passwordCheck) {
    return '* 비밀번호가 다릅니다.'
  }

  return null
}

function getPasswordCheckError(password, passwordCheck) {
  if (!passwordCheck) return '* 비밀번호를 한 번 더 입력해주세요'
  if (password !== passwordCheck) return '* 비밀번호가 다릅니다.'

  return null
}

function getNicknameError(nickname) {
  if (!nickname.trim()) return '* 닉네임을 입력해주세요.'
  if (/\s/.test(nickname)) return '* 띄어쓰기를 없애주세요'
  if (nickname.length > 10) {
    return '* 닉네임은 최대 10자 까지 작성 가능합니다.'
  }

  return null
}

function SignupPage() {
  const navigate = useNavigate()
  const {
    imageFile,
    previewUrl,
    selectImage,
    clearImage,
  } = useImagePreview()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [nickname, setNickname] = useState('')
  const [helpers, setHelpers] = useState({
    profile: '',
    email: '',
    password: '',
    passwordCheck: '',
    nickname: '',
  })

  const errors = {
    profile: imageFile ? null : DEFAULT_HELPERS.profile,
    email: getEmailError(email),
    password: getPasswordError(password, passwordCheck),
    passwordCheck: getPasswordCheckError(password, passwordCheck),
    nickname: getNicknameError(nickname),
  }
  const isValid = Object.values(errors).every((error) => error === null)

  const showError = (name) => {
    setHelpers((current) => ({
      ...current,
      [name]: errors[name] ?? '',
    }))
  }

  const showPasswordErrors = () => {
    setHelpers((current) => ({
      ...current,
      password: errors.password ?? '',
      passwordCheck: errors.passwordCheck ?? '',
    }))
  }

  const showAllErrors = () => {
    setHelpers({
      profile: errors.profile ?? '',
      email: errors.email ?? '',
      password: errors.password ?? '',
      passwordCheck: errors.passwordCheck ?? '',
      nickname: errors.nickname ?? '',
    })
  }

  const handleProfileChange = (event) => {
    const file = event.target.files[0]

    if (file) {
      selectImage(file)
      setHelpers((current) => ({
        ...current,
        profile: '',
      }))
    } else {
      clearImage()
      setHelpers((current) => ({
        ...current,
        profile: DEFAULT_HELPERS.profile,
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    showAllErrors()
    if (!isValid) return

    try {
      const uploaded = await uploadImage(imageFile)

      await signup({
        email: email.trim(),
        password,
        nickname: nickname.trim(),
        profile_image: uploaded.data.url,
      })

      navigate('/login')
    } catch (error) {
      if (error.message === API_ERROR_CODE.USER_ALREADY_EXISTS) {
        setHelpers((current) => ({
          ...current,
          email: `*${getApiErrorMessage(error)}`,
        }))
        return
      }

      if (error.message === API_ERROR_CODE.NICKNAME_ALREADY_EXISTS) {
        setHelpers((current) => ({
          ...current,
          nickname: `*${getApiErrorMessage(error)}`,
        }))
        return
      }

      window.alert(getApiErrorMessage(error))
    }
  }

  return (
    <main className="signup-page">
      <h2 className="page-title">회원가입</h2>

      <form className="signup-form" noValidate onSubmit={handleSubmit}>
        <div className="profile-group">
          <label htmlFor="profile-image">프로필 사진*</label>
          <p className="helper-text">{helpers.profile}</p>

          <label htmlFor="profile-image" className="profile-upload-box">
            {previewUrl ? (
              <img
                className="profile-preview"
                src={previewUrl}
                alt="프로필 미리보기"
              />
            ) : (
              <span>＋</span>
            )}
          </label>

          <input
            type="file"
            id="profile-image"
            name="profileImage"
            accept="image/*"
            hidden
            onClick={(event) => {
              event.currentTarget.value = ''
            }}
            onChange={handleProfileChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일*</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => showError('email')}
          />
          <p className="helper-text">{helpers.email}</p>
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호*</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={showPasswordErrors}
          />
          <p className="helper-text">{helpers.password}</p>
        </div>

        <div className="form-group">
          <label htmlFor="password-check">비밀번호 확인*</label>
          <input
            type="password"
            id="password-check"
            name="passwordCheck"
            placeholder="비밀번호를 한번 더 입력하세요"
            value={passwordCheck}
            onChange={(event) => setPasswordCheck(event.target.value)}
            onBlur={showPasswordErrors}
          />
          <p className="helper-text">{helpers.passwordCheck}</p>
        </div>

        <div className="form-group">
          <label htmlFor="nickname">닉네임*</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            placeholder="닉네임을 입력하세요"
            maxLength="10"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            onBlur={() => showError('nickname')}
          />
          <p className="helper-text">{helpers.nickname}</p>
        </div>

        <button
          type="submit"
          className={`signup-btn${isValid ? ' active' : ''}`}
          disabled={!isValid}
        >
          회원가입
        </button>
      </form>

      <button
        type="button"
        className="login-link-btn"
        onClick={() => navigate('/login')}
      >
        로그인하러 가기
      </button>
    </main>
  )
}

export default SignupPage
