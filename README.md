# 클로징

<p align="center">
  <img src=".github/assets/banner.png" alt="클로징" width="100%" />
</p>

React + TypeScript + Vite 기반으로 제작된 소상공인 폐업 지원 서비스 **"클로징"**의 프론트엔드 저장소입니다.

---

## 📌 프로젝트 소개

누군가에게 가게는 단순한 영업 공간이 아닙니다.

하루의 대부분을 보낸 **삶의 터전**이자, **가족의 생계를 책임지던 공간**이며, 수년간의 노력과 감정이 쌓인 흔적입니다.

하지만 많은 소상공인들은 폐업을 결정하는 순간부터 또 다른 현실과 마주하게 됩니다. 임대 정리, 세무 신고, 집기 처분, 지원금 신청까지 수많은 절차가 한꺼번에 쏟아지지만, 이를 처음 경험하는 소상공인들은 **무엇을 어디서부터 시작해야 하는지조차 알기 어렵습니다.**

누군가는 인터넷을 뒤지며 정보를 찾고, 누군가는 잘못된 순서로 일을 처리해 시간과 비용을 더 지불하기도 합니다. 이미 지쳐 있는 상황 속에서 폐업 과정은 단순한 행정 절차를 넘어 **심리적인 부담**으로 이어지기도 합니다.

클로징은 바로 이러한 문제에서 시작되었습니다. **복잡한 절차는 줄이고, 다시 시작할 여유는 더하는 것.** 그것이 클로징이 만들고자 하는 경험입니다.

---

## 👥 팀원 및 프론트엔드 역할 분담

| 팀원   | 담당 영역                               |
| ------ | --------------------------------------- |
| 김상엽 | 프론트엔드 리드, 중고거래, 사업자, 에러 |
| 박고은 | 가이드, 지원정보, 계정, 문의, 정책      |
| 송혜원 | 홈, AI                                  |
| 진준영 | 인증, 채팅                              |

---

## 🛠 기술 스택

- React
- TypeScript
- Vite
- TailwindCSS
- axios
- React Router DOM
- Tanstack Query
- Zustand
- Naver Maps API

---

## 📂 폴더 구조

```
src/
├── api/
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
│
├── auth/
│
├── components/
│   ├── account/
│   ├── ai/
│   ├── auth/
│   ├── chat/
│   ├── common/
│   ├── guide/
│   ├── home/
│   ├── inquiry/
│   ├── sidemenu/
│   ├── support/
│   └── used/
│
├── constants/
│
├── hooks/
│
├── pages/
│   ├── account/
│   ├── ai/
│   ├── auth/
│   ├── chat/
│   ├── error/
│   ├── guide/
│   ├── home/
│   ├── inquiry/
│   ├── policy/
│   ├── support/
│   └── used/
│
├── stores/
│
├── types/
│
├── utils/
│
├── App.tsx
├── index.css
├── main.tsx
└── queryClient.ts
```

## 🌱 전략 및 컨벤션

### 브랜치

**브랜치 전략**

- `main` : 최종 안정 버전
- `dev` : 개발 통합 브랜치
- `type/name/task` : 개인별 작업 브랜치

**브랜치 컨벤션**

```
타입/담당자/내용
```

예시

- `feat/junyoung/login`
- `fix/hyewon/home`
- `docs/goeun/readme`
- `refactor/sangyeop/used`

**브랜치 작업 순서**

1. `dev` 브랜치에서 최신 내용을 가져옵니다.
2. 각 팀원은 자신의 작업에 맞는 브랜치를 생성합니다.
3. 작업 완료 후 커밋 및 푸시를 진행합니다.
4. 작업 브랜치에서 `dev`로 PR을 생성합니다.
5. 리뷰 승인을 받은 뒤 `dev`에 머지합니다.
6. 작업이 끝난 브랜치는 삭제합니다.
7. 최종 점검 후 `dev`에서 `main`으로 PR을 생성해 머지합니다.

### 커밋

**커밋 컨벤션**

```
타입: 내용
```

| 타입       | 설명                                  | 예시                                          |
| ---------- | ------------------------------------- | --------------------------------------------- |
| `build`    | 빌드 시스템, 의존성 관련 추가 및 수정 | `build: vite 설정 수정`                       |
| `chore`    | 빌드, 설정, 패키지 등 기타 작업       | `chore: 프로젝트 초기 세팅`                   |
| `design`   | CSS 디자인 관련 변경                  | `design: 버튼 컴포넌트 색상 변경`             |
| `docs`     | 문서 수정                             | `docs: README 수정`                           |
| `feat`     | 새로운 기능 구현                      | `feat: 로그인 기능 구현`                      |
| `fix`      | 버그 수정                             | `fix: 로그인 시 토큰 만료 오류 수정`          |
| `perf`     | 성능 개선                             | `perf: 이미지 lazy loading 적용`              |
| `refactor` | 코드 리팩토링                         | `refactor: axios 인스턴스 분리`               |
| `remove`   | 코드 또는 파일 삭제                   | `remove: 사용하지 않는 App.css 삭제`          |
| `rename`   | 파일명 또는 폴더명 변경               | `rename: HomePage.tsx를 Home.tsx로 이름 변경` |
| `style`    | 코드 포맷팅                           | `style: prettier 적용`                        |

**커밋 규칙**

- `main` 브랜치에는 직접 커밋하지 않습니다.
- 모든 작업은 `dev` 브랜치에서 분기한 작업 브랜치에서 진행합니다.
- 작업 브랜치 이름은 `type/name/task` 형식을 따릅니다.
- 커밋 메시지는 `type: 변경 내용` 형식을 따릅니다.
- 머지 전 코드 및 변경 사항을 확인합니다.
- 의미 없는 커밋 메시지는 지양합니다.

### PR

**PR 컨벤션**

```
타입: 내용
```

PR 제목의 타입은 [커밋 컨벤션](#커밋)과 동일합니다.

**PR 본문 템플릿**

```
## 작업 내용
-

## 변경 이유
-

## 확인 사항
- [ ] 화면이 정상적으로 보이는지 확인
- [ ] 기능이 정상적으로 동작하는지 확인
- [ ] 콘솔 에러가 없는지 확인

## 스크린샷
-
```

**PR 규칙**

1. PR 제목만 보고 어떤 작업인지 알 수 있도록 작성합니다.
2. 하나의 PR에는 하나의 주요 작업만 포함합니다. 여러 기능을 한 번에 묶어 올리지 않습니다.
3. 작업 내용은 구체적으로 작성합니다. 단순히 "수정했습니다"라고 쓰지 않고, 어떤 부분을 수정했는지 작성합니다.
4. UI 변경이 있는 경우 스크린샷을 첨부합니다.
5. 기능 구현 또는 수정 후 직접 동작을 확인한 뒤 PR을 올립니다.
6. PR을 올리기 전 콘솔 에러가 없는지 확인합니다.
7. 충돌이 발생한 경우 해결한 뒤 PR을 업데이트합니다.
8. 리뷰어가 확인해야 할 부분이 있다면 PR 본문에 따로 작성합니다.

**PR 리뷰 규칙**

1. 리뷰어는 코드의 동작, 가독성, 컨벤션 준수 여부를 확인합니다.
2. 수정이 필요한 부분은 구체적으로 코멘트를 남깁니다.
3. 단순 취향 차이보다는 유지보수성, 오류 가능성, 팀 컨벤션을 기준으로 리뷰합니다.
4. PR 작성자는 리뷰 내용을 확인한 뒤 수정하거나, 필요한 경우 의견을 남깁니다.
5. 최소 1명 이상의 승인을 받은 뒤 머지합니다.

**머지 규칙**

1. 리뷰 승인 후 `main` 브랜치에 머지합니다.
2. 머지 전 최신 `main` 브랜치와 충돌이 없는지 확인합니다.
3. 머지 후 불필요한 작업 브랜치는 삭제합니다.
4. `main` 브랜치에는 직접 푸시하지 않습니다.

---

## 🚀 실행 방법

이 프로젝트는 React + TypeScript + Vite 템플릿을 기반으로 합니다. HMR과 일부 ESLint 규칙이 포함된 최소 구성입니다.

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint

# 백엔드 스펙과 타입 nullable 여부 드리프트 검사
npm run check:api
```

### 참고: Vite 공식 플러그인

현재 두 가지 공식 React 플러그인을 사용할 수 있습니다.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — [Oxc](https://oxc.rs/) 기반
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — [SWC](https://swc.rs/) 기반

### React Compiler

개발/빌드 성능에 영향을 줄 수 있어 이 템플릿에는 React Compiler가 기본 활성화되어 있지 않습니다. 필요 시 [공식 문서](https://react.dev/learn/react-compiler/installation)를 참고해 추가할 수 있습니다.

### ESLint 설정 확장

프로덕션 애플리케이션을 개발하는 경우, type-aware lint 규칙을 활성화하는 것을 권장합니다.

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

React 전용 lint 규칙을 위해 [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)와 [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)도 설치할 수 있습니다.

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

---

## 🖼 화면 목록

`src/constants/routes.ts`에 정의된 라우트와 `src/App.tsx`의 라우팅 기준으로 정리한 전체 화면 목록입니다.

| 화면 이름                  | Route Path               | Page Component            | 담당 파트 |
| -------------------------- | ------------------------ | ------------------------- | --------- |
| 로그인                     | `/login`                 | `LoginPage`               | 진준영    |
| 카카오 로그인 콜백         | `/auth/kakao/callback`   | `KakaoCallbackPage`       | 진준영    |
| 서비스 약관 동의           | `/terms`                 | `TermsPage`               | 진준영    |
| 홈                         | `/`                      | `HomePage`                | 송혜원    |
| AI 일정 생성               | `/ai`                    | `AIPage`                  | 송혜원    |
| AI 일정표                  | `/ai/plan/:sessionId`    | `AIPlanPage`              | 송혜원    |
| 사장님 폐업 가이드 목록    | `/guides`                | `GuideListPage`           | 박고은    |
| 가이드 상세                | `/guides/:stepId`        | `GuideDetailPage`         | 박고은    |
| 가이드 작성 템플릿: 안내문 | `/guides/2/template`     | `GuideNoticeTemplatePage` | 박고은    |
| 가이드 작성 템플릿: 신고서 | `/guides/6/template`     | `GuideReportTemplatePage` | 박고은    |
| 지원정보 목록              | `/supports`              | `SupportListPage`         | 박고은    |
| 지원정보 북마크 목록       | `/supports/bookmark`     | `SupportListPage`         | 박고은    |
| 지원정보 상세              | `/supports/:supportId`   | `SupportDetailPage`       | 박고은    |
| 중고거래 목록              | `/used`                  | `UsedListPage`            | 김상엽    |
| 중고거래 상세              | `/used/:productId`       | `UsedDetailPage`          | 김상엽    |
| 중고거래 검색              | `/used/search`           | `UsedSearchPage`          | 김상엽    |
| 중고거래 검색 결과         | `/used/search/result`    | `UsedSearchResultPage`    | 김상엽    |
| 중고거래 등록              | `/used/write`            | `UsedWritePage`           | 김상엽    |
| 중고거래 수정              | `/used/write/:productId` | `UsedWritePage`           | 김상엽    |
| 나의 판매물품              | `/used/my`               | `UsedMyProductsPage`      | 김상엽    |
| 관심 물품                  | `/used/liked`            | `UsedLikedProductsPage`   | 김상엽    |
| 채팅 목록                  | `/chats`                 | `ChatListPage`            | 진준영    |
| 채팅방                     | `/chats/:chatRoomId`     | `ChatRoomPage`            | 진준영    |
| 프로필 및 사업자 정보 수정 | `/profile`               | `ProfileEditPage`         | 박고은    |
| 사업자 인증                | `/business`              | `BusinessAuthPage`        | 김상엽    |
| 1:1 문의하기               | `/inquiry`               | `InquiryPage`             | 박고은    |
| 나의 문의내역              | `/inquiry/history`       | `InquiryHistoryPage`      | 박고은    |
| 약관 및 정책               | `/policy`                | `PolicyPage`              | 박고은    |
| 404 Not Found              | `*`                      | `NotFoundPage`            | 김상엽    |
