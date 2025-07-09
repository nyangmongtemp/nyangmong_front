# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/44c3fb57-bd17-4906-89ad-0792e0f4f9dc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/44c3fb57-bd17-4906-89ad-0792e0f4f9dc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Components

### CommentSection

재사용 가능한 댓글 컴포넌트입니다. 직접 백엔드 API와 통신하여 댓글의 생성, 조회, 수정, 삭제를 처리합니다.

#### Props

- `postId` (string/number, required): 게시물 ID
- `category` (string, required): 게시물 카테고리 ("community", "adoption" 등)
- `showReplies` (boolean, default: true): 답글 기능 표시 여부
- `className` (string, optional): 추가 CSS 클래스

#### 사용 예시

```jsx
import CommentSection from "@/components/CommentSection";

const MyComponent = () => {
  return (
    <CommentSection postId="123" category="community" showReplies={true} />
  );
};
```

#### 특징

- **자동 API 통신**: 백엔드와 직접 통신하여 댓글 CRUD 처리
- **카테고리별 API 분기**: 게시물 카테고리에 따라 적절한 API 호출
- **권한 기반 UI**: 본인이 작성한 댓글만 수정/삭제 가능
- **로딩 및 에러 처리**: 로딩 상태와 에러 메시지 표시
- **키보드 단축키**: Enter로 댓글 제출
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **커스터마이징 가능**: CSS 클래스로 스타일링 조정 가능

#### 지원하는 게시판

- **커뮤니티 게시판** (`category="community"`)
- **입양 게시판** (`category="adoption"`)
- 기타 게시판은 필요에 따라 API 함수 추가 가능

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/44c3fb57-bd17-4906-89ad-0792e0f4f9dc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
