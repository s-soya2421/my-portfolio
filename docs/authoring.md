# Authoring Guide

コンテンツはすべて `content/` ディレクトリ配下の MDX ファイルとして管理します。Frontmatter でメタ情報を定義し、本文は Markdown と MDX コンポーネントを組み合わせて記述します。

## 新しい記事・プロジェクトの追加手順

1. 対象ディレクトリを選びます。
   - プロジェクト: `content/projects`
   - ブログ: `content/blog`
   - 固定ページ: `content/pages`
2. `kebab-case` のファイル名で `.mdx` を作成します (例: `jamstack-modernization.mdx`)。
3. 下記 Frontmatter テンプレートを貼り付け、必要な項目を埋めます。
4. 本文を MDX で記述します。見出しは `##` から始め、論理的な構成(課題→アプローチ→結果)を心掛けてください。
5. 画像は `public/images/...` に保存し、Frontmatter の `cover` にパスを設定します。
6. Draft として下書きにしたい場合は `draft: true` を設定します。

## Frontmatter テンプレート

```md
---
title: 'タイトル'
description: '一覧に表示される 1〜2 行の要約'
date: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD' # 省略可
tags: ['タグ1', 'タグ2']
cover: '/images/...'
role: '役割' # プロジェクトのみ必須
tech: ['技術1'] # プロジェクトのみ必須
links:
  demo: ''
  repo: ''
impact_metrics:
  metric_name: 0
  metric_other: 0
draft: false
---
```

## 画像の配置

- `public/images/projects` : プロジェクト用サムネイル
- `public/images/blog` : ブログ用サムネイル
- `public/images/shared` : 共通で使う画像
- ファイル名は `slug` に揃えると管理しやすいです (例: `project-foo.svg`)。
- 大きさは 1200x630 を推奨、静的エクスポートの都合で `next/image` は `unoptimized` 設定です。

## スラッグ命名規則

- 英数字とハイフンのみを使用する。
- 日本語タイトルの場合でも英語に翻訳してスラッグ化する。
- バージョン違いは `v2`, `v3` などを後ろに付ける。

## ドラフト運用

- `draft: true` のファイルはビルド時に除外されます。
- 公開準備ができたら `draft: false` に変更し、`date` を公開日に合わせて更新してください。

## MDX Tips

- `components/mdx/mdx-components.tsx` でカスタムコンポーネントを追加できます。
- コードブロックは ```tsx のように言語を指定するとハイライトされます。
- 重要なポイントは引用 (`>`) を使って強調してください。
