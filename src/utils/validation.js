export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email)
}

export function isValidPassword(password) {
  return PASSWORD_PATTERN.test(password)
}
