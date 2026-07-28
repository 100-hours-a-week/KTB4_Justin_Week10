import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getApiErrorMessage } from '../utils/apiError.js'
import {
  isValidEmail,
  isValidPassword,
} from '../utils/validation.js'

const EMAIL_REQUIRED = '* 이메일을 입력해주세요.'
const PASSWORD_REQUIRED = '* 비밀번호를 입력해주세요.'
const EMAIL_INVALID =
  '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@email.com)'
const PASSWORD_INVALID =
  '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'

function getEmailError(email) {
  if (!email.trim()) return EMAIL_REQUIRED
  if (!isValidEmail(email)) return EMAIL_INVALID

  return null
}

function getPasswordError(password) {
  if (!password) return PASSWORD_REQUIRED
  if (!isValidPassword(password)) return PASSWORD_INVALID

  return null
}

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [helperText, setHelperText] = useState(EMAIL_REQUIRED)
  const validationError =
    getEmailError(email) ?? getPasswordError(password)
  const isValid = validationError === null

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (validationError) {
      setHelperText(validationError)
      return
    }

    try {
      await signIn({
        email: email.trim(),
        password,
      })

      const from = location.state?.from
      const redirectTo = from?.pathname
        ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
        : '/posts'

      navigate(redirectTo, { replace: true })
    } catch (error) {
      setHelperText(`* ${getApiErrorMessage(error)}`)
    }
  }

  const updateEmail = (value) => {
    setEmail(value)
    setHelperText(getEmailError(value) ?? getPasswordError(password) ?? '')
  }

  const updatePassword = (value) => {
    setPassword(value)
    setHelperText(getEmailError(email) ?? getPasswordError(value) ?? '')
  }

  return (
    <main className="login-page">
      <h2 className="page-title">로그인</h2>

      <form className="login-form" noValidate onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요"
            required
            value={email}
            onChange={(event) => updateEmail(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            required
            value={password}
            onChange={(event) => updatePassword(event.target.value)}
          />
        </div>

        <p className="helper-text">{helperText}</p>

        <button
          type="submit"
          className={`login-btn${isValid ? ' active' : ''}`}
          disabled={!isValid}
        >
          로그인
        </button>
      </form>

      <button
        className="signup-link-btn"
        type="button"
        onClick={() => navigate('/signup')}
      >
        회원가입
      </button>
    </main>
  )
}

export default LoginPage
