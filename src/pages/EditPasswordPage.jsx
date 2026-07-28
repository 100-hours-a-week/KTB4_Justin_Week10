import { useEffect, useRef, useState } from 'react'
import Toast from '../components/common/Toast.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { updatePassword } from '../services/userApi.js'
import { getApiErrorMessage } from '../utils/apiError.js'
import { isValidPassword } from '../utils/validation.js'

function getPasswordErrors(password, passwordConfirm) {
  if (!password) {
    return {
      password: '비밀번호를 입력해주세요.',
      passwordConfirm: '',
    }
  }

  if (!isValidPassword(password)) {
    return {
      password:
        '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.',
      passwordConfirm: '',
    }
  }

  if (!passwordConfirm) {
    return {
      password: '',
      passwordConfirm: '비밀번호를 한 번 더 입력해주세요.',
    }
  }

  if (password !== passwordConfirm) {
    return {
      password: '',
      passwordConfirm: '비밀번호가 일치하지 않습니다.',
    }
  }

  return {
    password: '',
    passwordConfirm: '',
  }
}

function EditPasswordPage() {
  const { user } = useAuth()
  const passwordInputRef = useRef(null)
  const toastTimerRef = useRef(null)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [helpers, setHelpers] = useState({
    password: '',
    passwordConfirm: '',
  })
  const [isToastVisible, setIsToastVisible] = useState(false)
  const validation = getPasswordErrors(password, passwordConfirm)
  const isValid =
    password !== '' &&
    passwordConfirm !== '' &&
    validation.password === '' &&
    validation.passwordConfirm === ''

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

  const updatePasswordValue = (value) => {
    setPassword(value)
    setHelpers(getPasswordErrors(value, passwordConfirm))
  }

  const updatePasswordConfirmValue = (value) => {
    setPasswordConfirm(value)
    setHelpers(getPasswordErrors(password, value))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const errors = getPasswordErrors(password, passwordConfirm)
    setHelpers(errors)

    if (!isValid) {
      passwordInputRef.current?.focus()
      return
    }

    try {
      await updatePassword(user.id, {
        new_password: password,
      })
      showToast()
    } catch (error) {
      window.alert(getApiErrorMessage(error))
    }
  }

  return (
    <main className="edit-password-page">
      <h2>비밀번호 수정</h2>

      <form id="edit-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            ref={passwordInputRef}
            id="password"
            name="password"
            type="password"
            minLength="8"
            maxLength="20"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(event) => updatePasswordValue(event.target.value)}
          />
          <p className="helper-text">{helpers.password}</p>
        </div>

        <div className="form-group">
          <label htmlFor="password-confirm">비밀번호 확인</label>
          <input
            id="password-confirm"
            name="passwordConfirm"
            type="password"
            minLength="8"
            maxLength="20"
            placeholder="비밀번호를 한번 더 입력하세요"
            value={passwordConfirm}
            onChange={(event) =>
              updatePasswordConfirmValue(event.target.value)
            }
          />
          <p className="helper-text">{helpers.passwordConfirm}</p>
        </div>

        <button id="submit-btn" type="submit" disabled={!isValid}>
          수정하기
        </button>
      </form>

      <Toast isVisible={isToastVisible} message="수정완료" />
    </main>
  )
}

export default EditPasswordPage
