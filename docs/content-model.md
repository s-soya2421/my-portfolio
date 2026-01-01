# Content Model

このドキュメントでは `content/` ディレクトリで利用する Frontmatter の構造を定義します。プロジェクトとブログで共通する項目は「Base」、各コンテンツ固有の拡張フィールドを詳細化します。

## BaseFrontmatter

| フィールド    | 型       | 必須 | 説明                                           |
| ------------- | -------- | ---- | ---------------------------------------------- |
| `title`       | string   | ✅   | ページ・カードに表示するタイトル               |
| `description` | string   | ✅   | 一覧・OG で利用する要約 120 字程度             |
| `date`        | ISO8601  | ⭕️   | 初回公開日。ブログでは必須、プロジェクトは任意 |
| `updated`     | ISO8601  | ⭕️   | 最終更新日。未指定時は `date` を利用           |
| `tags`        | string[] | ✅   | 3〜5 個を目安に設定。フィルタやメタ情報に利用  |
| `cover`       | string   | ⭕️   | サムネイル画像へのパス (`/images/...`)         |
| `draft`       | boolean  | ✅   | `true` の場合は一覧・ビルドから除外            |

## ProjectFrontmatter 拡張

| フィールド       | 型                    | 必須 | 説明                                               |
| ---------------- | --------------------- | ---- | -------------------------------------------------- |
| `role`           | string                | ✅   | プロジェクト内で担った役割                         |
| `tech`           | string[]              | ✅   | 主要な技術スタック。UI には最大 6 件表示           |
| `links.demo`     | string (URL)          | ⭕️   | プロジェクトデモへのリンク                         |
| `links.repo`     | string (URL)          | ⭕️   | 公開リポジトリへのリンク                           |
| `impact_metrics` | Record<string,number> | ⭕️   | ビジネス/プロダクトの成果指標。`users`, `dau` など |

## BlogFrontmatter 拡張

追加フィールドはありません。`loadCollection` が自動で `readingTime` を付与します。`date` は公開日の記録に利用するため必ず設定してください。

## PagesFrontmatter 拡張

固定ページ (`about` など) は Base のみを利用します。必要な追加情報は本文の MDX 内で表現してください。

## 命名と配置

```
content/
├── projects/
│   ├── fitnesssns.mdx
│   └── location-share.mdx
├── blog/
│   └── <post-slug>.mdx
├── pages/
│   └── about.mdx
└── en/
    ├── projects/
    │   └── <project-slug>.mdx
    ├── blog/
    │   └── <post-slug>.mdx
    └── pages/
        └── about.mdx
```

- ファイル名はスラッグと一致させます。
- 画像は `public/images/<collection>/` に保存します。
- OG 画像は `npm run og` 実行時に `public/og/` へ自動生成されます。
- 英語版は `content/en/<collection>/` に配置し、日本語版と同じスラッグを使います。

## バリデーション

- フロントマターの型安全性は `lib/content.ts` の TypeScript 定義で担保。
- 追加フィールドが必要になった場合は型を拡張し、テストを更新してください。
