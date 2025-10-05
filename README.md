# Soya — Engineer Portfolio

静的エクスポート可能な Next.js (App Router) ベースのポートフォリオサイトです。Tailwind CSS + shadcn/ui + lucide-react を採用し、MDXでコンテンツを管理します。SSG 前提で構成しているため、Vercel や静的ホスティングへのデプロイが容易です。

## 特徴
- App Router + SSG (`output: 'export'`)
- ダーク/ライトテーマ + 日本語/英語トグル
- Markdown/MDX + Frontmatter でのコンテンツ管理
- Tailwind カスタムテーマ + shadcn/ui コンポーネント
- OG 画像のビルド時自動生成 (`npm run og`)
- Vitest + Testing Library によるユニットテスト

## セットアップ
```bash
npm install
npm run dev
```
開発サーバーは `http://localhost:3000` で起動します。GA4 を利用する場合は `.env` を作成し `NEXT_PUBLIC_GA_ID` を設定してください。

## スクリプト
| コマンド | 説明 |
| -------- | ---- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | Next.js ビルド |
| `npm run export` | ビルド + 静的書き出し (`out/`) |
| `npm run start` | `out/` をローカル配信 (`serve`) |
| `npm run lint` | ESLint 実行 |
| `npm run format` | Prettier で整形 |
| `npm run test` | Vitest 実行 |
| `npm run og` | OG 画像生成 (`public/images/og-default.png`, `public/og/*`) |

## コンテンツ運用
- すべてのコンテンツは `content/` 配下の MDX で管理します。
- Frontmatter 仕様は `docs/content-model.md` を参照してください。
- 追加手順は `docs/authoring.md` にまとめています。
- 画像は `public/images/<collection>/` に配置し、1200x630 を推奨します。

## 品質確認
- `npm run lint` と `npm run test` を PR 前に必ず実行してください。
- `npm run export` でビルドが通ることを確認し、`out/` をデプロイ対象にします。
- Lighthouse デスクトップ計測の推奨手順:
  1. `npm run export`
  2. `npm run start`
  3. Chrome DevTools > Lighthouse (Performance / Accessibility / Best Practices / SEO) を実行し 95+ を目指す。

## デプロイ
- Vercel での静的ホスティング、もしくは任意の静的サイトホスティングへ `out/` ディレクトリをアップロードします。
- GA4 等のキーは環境ごとに `.env` を用意し、Build 前に注入してください。

## その他
- 作業ルールや Definition of Done は `AGENTS.md` を確認してください。
- テーマ/言語の切り替え状態はローカルストレージに保存されます。
