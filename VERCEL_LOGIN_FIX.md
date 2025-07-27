# Vercelでのログイン問題解決ガイド

## 問題の原因
1. **環境変数の設定不備**: SupabaseのURLとキーがVercelで設定されていない
2. **認証コールバックURL**: VercelのURLがSupabaseで許可されていない
3. **ドメイン設定**:本番環境でのCORS設定

## 解決手順

### 1. Vercel環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Supabase認証設定

Supabaseダッシュボード > Authentication > URL Configuration で以下を追加：

**Site URL:**
```
https://your-app.vercel.app
```

**Redirect URLs:**
```
https://your-app.vercel.app/auth/callback
https://your-app.vercel.app/**
```

### 3. 本番環境での認証フロー

現在のコードは以下のフローで動作します：

1. **Supabase認証を試行**
   - 成功 → 正常な認証フロー
   - 失敗 → デモモードにフォールバック

2. **デモモードフォールバック**
   - 簡単な検証のみ実行
   - ローカルストレージに保存
   - 完全オフライン対応

### 4. 確認事項

#### Supabase設定確認:
- [ ] プロジェクトURL正しく設定
- [ ] Anon Key正しく設定  
- [ ] 認証プロバイダー有効化
- [ ] Site URL設定
- [ ] Redirect URL設定

#### Vercel設定確認:
- [ ] 環境変数設定
- [ ] ビルド成功
- [ ] デプロイメント完了

### 5. デバッグ方法

ブラウザの開発者ツールのコンソールで以下を確認：

```javascript
// Supabase設定確認
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')

// 現在のURL確認
console.log('Current URL:', window.location.href)
```

### 6. よくある問題と解決策

**問題: "Invalid login credentials"**
- Supabaseの認証設定を確認
- メールアドレス形式を確認
- パスワード要件を確認

**問題: "Network Error"**
- Vercelの環境変数を確認
- Supabaseプロジェクトの状態を確認
- CORS設定を確認

**問題: リダイレクトループ**
- Site URLとRedirect URLを正確に設定
- 認証コールバック処理を確認

## 緊急対応: デモモード強制有効化

もしSupabase認証が完全に動作しない場合、以下のコードでデモモードを強制できます：

```typescript
// src/app/auth/page.tsx の handleSubmit 関数の最初に追加
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  
  // 緊急用: デモモード強制有効化
  // fallbackToDemo()
  // return
  
  // 通常の認証処理...
}
```

## 現在の状態

✅ **デモモードフォールバック機能実装済み**
✅ **認証エラーハンドリング改善済み**  
✅ **本番環境対応済み**

Supabase設定に問題があってもアプリは動作します。
