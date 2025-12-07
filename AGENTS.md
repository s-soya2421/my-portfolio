# Agent Handbook

This document combines the high-level repository guidelines and the agent-specific operating guide that used to live in `docs/agent-readme.md`.

## Repository Guidelines

### Project Structure & Module Organization

This portfolio repository starts minimal; create `src/` to hold all application code. Keep page-level routes inside `src/pages`, reused pieces in `src/components`, and global styles in `src/styles`. Static favicons, images, and resume exports stay in `public/` so they deploy unchanged. Store CMS or markdown copy in `content/` with one file per section (`content/about.md`, etc.) and mirror that structure in `src/pages`.

### Build, Test, and Development Commands

Install dependencies with `npm install` after cloning. Run `npm run dev` for the local preview server; add environment variables in `.env.local` if the server references external APIs. `npm run build` should produce the optimized bundle in `dist/`, and must succeed before every push. Use `npm run preview` to smoke-test the production build locally. Once tests exist, expose them through `npm run test` so CI can reuse the same entry point.

### Coding Style & Naming Conventions

Prefer TypeScript or typed JavaScript in `src/` and keep components small and focused. Use two-space indentation, single quotes, and trailing commas where valid -- configure Prettier and ESLint to enforce this (`npm run lint`). Components and hooks use PascalCase (`HeroBanner.tsx`) and camelCase for functions and variables. Use Tailwind CSS for styling; component-specific styles should be applied via Tailwind utility classes. Keep imports sorted: third-party first, followed by absolute aliases, then relative paths.

### Testing Guidelines

Adopt Vitest and Testing Library for unit and integration coverage; place specs alongside modules as `ComponentName.test.tsx`. Name suites after the component or feature under test and include accessibility assertions for visual elements. Keep coverage above 80% for `src/components` and 100% for utility helpers. Run `npm run test -- --watch` during development and `npm run test -- --runInBand --coverage` in CI before merging.

### Commit & Pull Request Guidelines

Follow Conventional Commits (`feat:`, `fix:`, `docs:`) to keep history searchable; avoid combining unrelated changes. Each pull request should link relevant issue numbers, describe the user-visible outcome, and list verification steps. Include before/after screenshots or GIFs for UI updates and paste console output for build or test changes. Request review once CI passes and update the README when new scripts or directories appear.

### Content & Asset Management

Version large images through Git LFS if they exceed 5 MB, otherwise compress with `npx imagemin`. Store secrets in `.env` files ignored by git and document required keys in `README.md`. Remove personal data before committing sample content.

## Agent Operating Guide (日本語)

### ディレクトリ構成

- アプリケーションコード: `app/`, `components/`, `lib/`
- コンテンツ: `content/` (MDX)
- ドキュメント: `docs/`
- スタイル: `styles/globals.css`
- スクリプト: `scripts/`
- テスト: `tests/`

### コマンド

| タスク                    | コマンド         |
| ------------------------- | ---------------- |
| 依存関係インストール      | `npm install`    |
| 開発サーバー              | `npm run dev`    |
| 静的ビルド + エクスポート | `npm run export` |
| Lint                      | `npm run lint`   |
| フォーマット              | `npm run format` |
| テスト                    | `npm run test`   |
| OG 画像生成               | `npm run og`     |

`npm run export` は `npm run og` を事前に実行し、`out/` に静的ファイルを生成します。

### 命名規則

- TypeScript/React ファイル: `kebab-case` でディレクトリ、`camelCase` / `PascalCase` でコンポーネント。
- コンテンツファイル: `kebab-case.mdx`
- コンポーネント: Client Component の場合はファイル先頭に `'use client'` を明記。

### コーディングスタイル

- インデントは 2 スペース。
- `next-themes`, `use client` を併用する際は SSR 差分に注意。
- `lib/content.ts` の API を経由してコンテンツを取得すること。直接 `fs` を触らない。
- テーマ/言語切替の状態はクライアントに保持し、サーバーコンポーネントではハードコードした文言を利用してもよい。

### 作業前の確認

- 新しい作業を始める前に、必ずユーザーへ実施の可否を確認し、承認を得てから着手すること。

### 禁止事項

- `git reset --hard` や `git push --force` といった強制系コマンドは禁止。
- 履歴を調整する場合は `git revert` など非破壊的な手段を優先すること。
- ユーザーから明示的に指示された作業以外は行わないこと。

### Definition of Done

- `npm run dev` で主要ページ (`/`, `/about`, `/projects`, `/projects/[slug]`, `/blog`) が 404 なく表示される。
- `npm run build && npm run export` が成功し、`out/` が生成される。
- `npm run lint` と `npm run test` が成功する。
- Lighthouse (デスクトップ) で 95+ を維持できる構成を意識する。
- ドキュメント (`docs/`) を更新し、必要な手順を利用者が追えるようにする。

### 備考

- 外部サービス連携のための環境変数は `.env.example` に追記すること。
- 公開不要なドラフトは `draft: true` を設定し、コミット前に誤って公開されないように注意。
