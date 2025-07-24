# PenaApp 🐬

上智大学KpopSDGsペナルティキック研究会ドルフィンズの公式アプリです。

## 📖 概要

PenaAppは、サークルメンバー同士のコミュニケーション促進、イベント参加管理、ゲーミフィケーション機能を通じて、サークル活動をより活発で楽しいものにするアプリです。

## ✨ 主要機能

- **🎯 イベント管理**: 練習・イベントの参加申込とカレンダー表示
- **👥 メンバー交流**: 投稿・写真共有・コメント機能
- **🏆 ゲーミフィケーション**: ポイント獲得、バッジ収集、ランキング
- **🎵 専門機能**: K-pop、ペナルティキック、SDGs活動の記録

## 🛠 技術スタック

- **Frontend**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 🚀 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

1. リポジトリをクローン:
```bash
git clone <repository-url>
cd pena-app-develop
```

2. 依存関係をインストール:
```bash
npm install
```

3. 環境変数を設定:
```bash
cp .env.local.example .env.local
# .env.localファイルを編集してSupabaseの設定を追加
```

4. 開発サーバーを起動:

```bash
npm run dev
```

5. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 📁 プロジェクト構造

```
src/
├── app/                 # Next.js App Router
├── components/          # React コンポーネント
│   ├── ui/             # 基本UIコンポーネント
│   ├── features/       # 機能別コンポーネント
│   └── layout/         # レイアウトコンポーネント
├── lib/                # ユーティリティ関数
│   └── supabase/       # Supabase設定
├── types/              # TypeScript型定義
└── hooks/              # カスタムReactフック
```

## 🎨 デザインシステム

- **Primary Color**: #0080FF (ドルフィンブルー)
- **Accent Color**: #FF6B9D (K-popピンク) 
- **Success Color**: #4CAF50 (SDGsグリーン)

## 📋 開発ロードマップ

### Phase 1: 基本機能 (現在)
- [x] プロジェクト基盤構築
- [x] UI/UXデザイン
- [ ] 認証システム
- [ ] イベント管理機能

### Phase 2: 拡張機能
- [ ] ポイント・ゲーミフィケーション
- [ ] メンバー交流機能
- [ ] 専門機能実装

### Phase 3: 最適化・リリース
- [ ] パフォーマンス最適化
- [ ] テスト・品質改善
- [ ] プロダクション環境デプロイ

## 🤝 開発ガイドライン

1. **TypeScript**: 厳密な型定義を使用
2. **Tailwind CSS**: カスタムCSSを避け、Tailwindクラスを優先
3. **コンポーネント**: 機能単位で小さく分割
4. **コミット**: 意味のある単位でコミット

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

---

**Created with ❤️ for 上智大学KpopSDGsペナルティキック研究会ドルフィンズ**
