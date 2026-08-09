# 🎵 TuneLog

## Front-end 소개

- 좋아하는 음악과 감상평을 공유하는 음악 커뮤니티 서비스입니다.
- `React 19`와 `Vite`를 사용해 SPA(Single Page Application)로 구현했습니다.
- 곡명·가수·작성자 통합 검색, 자동완성, 장르 필터, 최신·인기 정렬을 하나의 게시글 화면에서 제공합니다.
- JWT Access Token을 이용해 로그인 상태를 관리하고 보호된 화면의 접근을 제어합니다.
- 반응형 레이아웃을 적용해 데스크톱과 모바일에서 사용할 수 있도록 구성했습니다.

### 개발 인원 및 기간

- 개발 기간: 2026.05 ~ 진행 중
- 개발 인원: 프론트엔드/백엔드 1명
- 개발자: [@shet6006](https://github.com/shet6006)

### 사용 기술 및 도구

| 구분 | 기술 |
| --- | --- |
| Core | React 19, JavaScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | CSS |
| Web Server | Nginx |
| Deployment | Docker, Docker Compose, GitHub Actions, GHCR, AWS EC2 |

### Back-end

- [TuneLog Back-end GitHub](https://github.com/100-hours-a-week/KTB4_Justin_Week4)

## 주요 기능

### 인증과 사용자

```text
- 회원가입과 로그인
- JWT Access Token 기반 인증 상태 관리
- 인증이 필요한 경로 접근 제어
- 닉네임·프로필 이미지·비밀번호 수정
- 회원 탈퇴와 탈퇴 사용자 기본 프로필 처리
```

### 게시글

```text
- 음악 감상평 작성·조회·수정·삭제
- 곡명·가수·장르와 이미지 0~1장 등록
- 최신순·인기순 정렬
- 장르별 필터링
- 좋아요를 누른 게시글 모아보기
- 서버 페이지네이션과 페이지 전환 애니메이션
```

### 검색

```text
- 곡명·가수·작성자 통합 검색
- 300ms 디바운스를 적용한 검색어 자동완성
- 검색어와 장르·정렬·좋아요 필터 조합
- 적용된 검색어를 URL Query Parameter로 관리
- 검색 결과 건수와 현재 검색 상태 표시
```

### 댓글과 좋아요

```text
- 댓글 작성·조회·수정·삭제
- 댓글 10개 단위 서버 페이지네이션
- 게시글 좋아요 추가·취소
- 비로그인 상태에서 상호작용하면 로그인 안내
```


## 폴더 구조

<details>
<summary>폴더 구조 보기/숨기기</summary>

```text
.
├── .github
│   └── workflows
│       └── deploy-image.yml
├── public
├── src
│   ├── app
│   │   ├── App.jsx
│   │   └── router.jsx
│   ├── assets
│   ├── components
│   │   ├── comment
│   │   ├── common
│   │   ├── header
│   │   └── post
│   ├── contexts
│   ├── hooks
│   ├── layouts
│   ├── pages
│   ├── services
│   ├── styles
│   └── utils
├── Dockerfile
├── nginx.conf
├── package.json
└── vite.config.js
```

</details>

## 로컬 실행

### 요구 사항

- Node.js 22 이상
- 실행 중인 TuneLog Backend (`http://localhost:8080`)

### 환경변수

프로젝트 루트에 `.env.local`을 생성합니다.

```env
API_BASE_URL=http://localhost:8080
```

### 실행 명령

```bash
npm ci
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

```bash
npm run lint
npm run build
```

## 배포

Frontend Dockerfile은 멀티스테이지 빌드를 사용합니다.

```text
Node.js 이미지에서 의존성 설치와 React 빌드
→ dist 생성
→ Nginx 이미지에 dist와 nginx.conf 복사
→ 정적 파일을 제공하는 최종 이미지 생성
```

`main` 브랜치에 변경사항이 반영되면 GitHub Actions가 다음 작업을 수행합니다.

```text
소스코드 Checkout
→ Docker Buildx로 linux/amd64 이미지 빌드
→ GHCR에 latest·commit SHA 태그 Push
→ EC2 Self-hosted Runner에서 이미지 Pull
→ Docker Compose로 Frontend 컨테이너 교체
→ HTTP 응답 확인
```

## 후기
