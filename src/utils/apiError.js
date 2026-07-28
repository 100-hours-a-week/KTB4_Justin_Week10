export const API_ERROR_CODE = {
  USER_NOT_FOUND: 'user_not_found',
  POST_NOT_FOUND: 'post_not_found',
  COMMENT_NOT_FOUND: 'comment_not_found',
  USER_ALREADY_EXISTS: 'user_already_exists',
  NICKNAME_ALREADY_EXISTS: 'nickname_already_exists',
  ALREADY_LIKED: 'already_liked',
  LIKE_NOT_FOUND: 'like_not_found',
  INVALID_CREDENTIALS: 'invalid_credentials',
  AUTHENTICATION_REQUIRED: 'authentication_required',
  ACCESS_DENIED: 'access_denied',
  REQUIRED_FIELD_MISSING: 'required_field_missing',
  INVALID_REQUEST: 'invalid_request',
  INTERNAL_SERVER_ERROR: 'internal_server_error',
}

const API_ERROR_MESSAGES = {
  user_not_found: '사용자를 찾을 수 없습니다.',
  post_not_found: '게시글을 찾을 수 없습니다.',
  comment_not_found: '댓글을 찾을 수 없습니다.',
  user_already_exists: '이미 사용 중인 이메일입니다.',
  nickname_already_exists: '이미 사용 중인 닉네임입니다.',
  already_liked: '이미 좋아요한 게시글입니다.',
  like_not_found: '좋아요가 없습니다.',
  invalid_credentials: '아이디 또는 비밀번호를 확인해주세요.',
  authentication_required: '로그인이 필요합니다.',
  access_denied: '접근이 거부되었습니다.',
  required_field_missing: '필수 항목을 입력해주세요.',
  invalid_request: '잘못된 요청입니다.',
  internal_server_error: '서버 오류가 발생했습니다.',
}

export function getApiErrorMessage(error) {
  return API_ERROR_MESSAGES[error?.message] ?? '요청에 실패했습니다.'
}
