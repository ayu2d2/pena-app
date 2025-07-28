# 🚀 PenaApp Vercelデプロイガイド

## 📋 デプロイ準備チェックリスト

### ✅ 完了済み
- [x] コードをGitHubにプッシュ
- [x] CPUレベル選択機能実装
- [x] Supabase認証システム実装
- [x] デモモードフォールバック機能
- [x] プロダクション対応

### 🔧 Vercelデプロイ手順

#### 1. Vercelアカウント作成
- [Vercel](https://vercel.com/)にアクセス
- GitHubアカウントでサインアップ

#### 2. プロジェクトのインポート
```
1. Vercelダッシュボードで「New Project」
2. GitHubから「ayu2d2/pena-app」を選択
3. ブランチ: ayu2d2
4. 「Import」をクリック
```

#### 3. 環境変数の設定
Vercelの設定画面で以下を追加：

```bash
# Supabase設定（オプション）
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# デプロイ環境
NODE_ENV=production
```

> **注意**: 環境変数が設定されていなくてもアプリは動作します（デモモード）

#### 4. ビルド設定（自動検出）
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

#### 5. Supabase設定（オプション）
もしSupabaseを使用する場合：

1. **Supabase URL Configuration**
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

2. **認証プロバイダー設定**
   - Email & Password: 有効化
   - その他必要なプロバイダー

### 🎯 デプロイ後の確認

#### 基本機能テスト
- [ ] ホームページが表示される
- [ ] 認証ページが動作する
- [ ] ポーカーゲームが起動する
- [ ] CPU難易度選択が動作する

#### 認証テスト
- [ ] Supabase認証（設定済みの場合）
- [ ] デモモード認証（フォールバック）
- [ ] ダッシュボードアクセス

### 🚨 トラブルシューティング

#### ビルドエラー
```bash
# ローカルでビルドテスト
npm run build
npm run start
```

#### 認証エラー
- Supabase設定を確認
- 環境変数を確認
- デモモードで動作確認

#### パフォーマンス最適化
- 画像最適化の確認
- バンドルサイズの確認
- Core Web Vitalsの確認

## 🎉 デプロイ完了！

デプロイが成功すると：
- ✅ Vercel URL が生成される
- ✅ 自動HTTPS設定
- ✅ CDN配信
- ✅ 自動プレビューデプロイ

### 🔄 継続的デプロイ
GitHubにプッシュするだけで自動デプロイされます！

```bash
git add .
git commit -m "新機能追加"
git push origin ayu2d2
# → Vercelで自動デプロイ開始
```

---

## 📞 サポート

何か問題があれば：
1. Vercelのビルドログを確認
2. ブラウザのコンソールエラーを確認
3. `VERCEL_LOGIN_FIX.md`の内容を参照

**Happy Deploying! 🚀**
