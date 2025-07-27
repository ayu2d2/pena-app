# 🎰 PenaApp ポーカー機能実装プラン

## 📋 機能概要

### 基本機能
- **ポイント制ベット**: イベント参加で獲得したポイントを使用
- **テキサスホールデム**: 標準的なポーカールール
- **CPU対戦**: 初心者向けAI対戦
- **マルチプレイヤー**: リアルタイム対戦（2-6人）
- **統計・ランキング**: 勝率、獲得ポイント、リーダーボード

### リアルタイム機能（Supabase Realtime使用）
- **ライブゲーム**: プレイヤー同士のリアルタイム対戦
- **観戦モード**: 他のプレイヤーのゲームを観戦
- **チャット機能**: ゲーム中のコミュニケーション
- **プッシュ通知**: ターン通知、ゲーム招待

## 🏗️ 技術実装

### データベース設計
```sql
-- ポーカーゲーム管理
CREATE TABLE poker_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_name VARCHAR(50),
    game_type VARCHAR(20) DEFAULT 'texas_holdem',
    max_players INTEGER DEFAULT 6,
    min_bet INTEGER DEFAULT 10,
    status VARCHAR(20) DEFAULT 'waiting', -- waiting, playing, finished
    current_player_id UUID,
    pot INTEGER DEFAULT 0,
    community_cards JSONB DEFAULT '[]',
    round_phase VARCHAR(20) DEFAULT 'preflop', -- preflop, flop, turn, river, showdown
    created_at TIMESTAMP DEFAULT NOW(),
    finished_at TIMESTAMP
);

-- プレイヤー参加管理
CREATE TABLE poker_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES poker_games(id),
    user_id UUID REFERENCES users(id),
    chips INTEGER,
    hole_cards JSONB DEFAULT '[]',
    current_bet INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, folded, all_in, out
    seat_position INTEGER,
    joined_at TIMESTAMP DEFAULT NOW()
);

-- ゲームアクション履歴
CREATE TABLE poker_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES poker_games(id),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(20), -- fold, call, raise, check, all_in
    amount INTEGER DEFAULT 0,
    round_phase VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ポーカー統計
CREATE TABLE poker_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    total_chips_won INTEGER DEFAULT 0,
    total_chips_lost INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN games_played > 0 
        THEN (games_won::DECIMAL / games_played) * 100 
        ELSE 0 END
    ) STORED,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### フロントエンド構成
```
src/
├── app/
│   └── poker/
│       ├── page.tsx              # ポーカーホーム
│       ├── lobby/page.tsx        # ゲームロビー
│       ├── game/[id]/page.tsx    # ゲーム画面
│       └── stats/page.tsx        # 統計・ランキング
├── components/
│   └── poker/
│       ├── GameTable.tsx         # ポーカーテーブル
│       ├── PlayerSeat.tsx        # プレイヤー席
│       ├── CardDeck.tsx          # カード表示
│       ├── BettingControls.tsx   # ベットコントロール
│       ├── ChatBox.tsx           # チャット機能
│       └── GameLobby.tsx         # ロビー管理
└── lib/
    └── poker/
        ├── gameLogic.ts          # ポーカーロジック
        ├── cardUtils.ts          # カード処理
        ├── realtime.ts           # リアルタイム通信
        └── aiPlayer.ts           # AI対戦ロジック
```

## 🎮 ユーザー体験フロー

### 1. ロビー
- 既存ゲーム一覧表示
- 新規ゲーム作成
- 友達招待機能
- 観戦可能ゲーム

### 2. ゲーム画面
- 美しいポーカーテーブル UI
- アニメーション付きカード配布
- リアルタイムベットアクション
- プレイヤーステータス表示

### 3. 統計・実績
- 個人成績グラフ
- 全体ランキング
- バッジ・称号システム
- 月間トーナメント

## 🚀 段階的実装プラン

### Phase 1: 基盤構築 (2-3週間)
- [ ] データベース設計・マイグレーション
- [ ] 基本ポーカーロジック実装
- [ ] UI/UXデザイン
- [ ] CPU対戦機能

### Phase 2: マルチプレイヤー (2-3週間)
- [ ] Supabase Realtime統合
- [ ] ゲームロビー機能
- [ ] リアルタイム対戦システム
- [ ] チャット機能

### Phase 3: 高度な機能 (2-3週間)
- [ ] 統計・ランキングシステム
- [ ] トーナメント機能
- [ ] 観戦モード
- [ ] プッシュ通知

### Phase 4: 最適化・拡張 (1-2週間)
- [ ] パフォーマンス最適化
- [ ] モバイル UI改善
- [ ] バグ修正・テスト
- [ ] 分析・改善

## 💡 追加アイデア

### ゲーミフィケーション連携
- **イベント参加ボーナス**: イベント参加でポーカーチップ獲得
- **特別トーナメント**: 月1回の大会開催
- **称号システム**: 「ポーカーマスター」「ブラフキング」等
- **アチーブメント**: 連勝記録、大勝利等の実績

### ソーシャル機能
- **フレンドシステム**: 友達同士でのプライベートゲーム
- **観戦機能**: 他プレイヤーのゲームを観戦
- **リプレイ機能**: ゲーム録画・共有
- **コミュニティ**: ポーカー戦略ディスカッション

## 🔧 技術的考慮事項

### Supabase Realtime活用
- **リアルタイム同期**: ゲーム状態の即座反映
- **接続管理**: プレイヤーの入退室検知
- **データ整合性**: 同時アクション処理
- **スケーラビリティ**: 複数ゲーム同時進行

### セキュリティ
- **サーバーサイド検証**: 全アクションのバリデーション
- **不正防止**: チート検知システム
- **データ暗号化**: カード情報の安全な管理
- **レート制限**: スパム防止

## 🎯 期待される効果

### ユーザーエンゲージメント向上
- **滞在時間増加**: ゲーム要素による長時間利用
- **リテンション向上**: 定期的なポーカーゲーム参加
- **コミュニティ活性化**: プレイヤー同士の交流促進

### PenaAppとの相乗効果
- **ポイント価値向上**: ポーカーでのポイント活用
- **イベント参加促進**: ポーカーチップ獲得目的
- **メンバー獲得**: ポーカー機能による新規ユーザー

この機能は完全に実装可能で、PenaAppの魅力を大幅に向上させると思います！🎉
