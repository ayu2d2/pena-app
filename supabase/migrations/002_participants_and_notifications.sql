-- 参加者テーブルの追加
CREATE TABLE IF NOT EXISTS event_participations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 同じユーザーが同じイベントに複数回参加できないようにする
  UNIQUE(user_id, event_id)
);

-- 通知設定テーブルの追加
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,
  notification_times INTEGER[] DEFAULT '{60, 15}', -- 分単位での通知タイミング（60分前、15分前）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 同じユーザーが同じイベントに複数の通知設定を持てないようにする
  UNIQUE(user_id, event_id)
);

-- インデックスの追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_event_participations_user_id ON event_participations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participations_event_id ON event_participations(event_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_event_id ON user_notifications(event_id);

-- RLS（Row Level Security）ポリシーの設定
ALTER TABLE event_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- 参加者テーブルのRLSポリシー
CREATE POLICY "Users can view all event participations" ON event_participations
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own participations" ON event_participations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own participations" ON event_participations
  FOR DELETE USING (auth.uid() = user_id);

-- 通知設定テーブルのRLSポリシー
CREATE POLICY "Users can view their own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON user_notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON user_notifications
  FOR DELETE USING (auth.uid() = user_id);

-- 更新時刻を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーの設定
CREATE TRIGGER update_event_participations_updated_at 
  BEFORE UPDATE ON event_participations 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_notifications_updated_at 
  BEFORE UPDATE ON user_notifications 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 参加者数のリアルタイム更新のためのビュー
CREATE OR REPLACE VIEW event_participants_count AS
SELECT 
  e.id as event_id,
  e.title,
  e.max_participants,
  COUNT(ep.id) as current_participants,
  CASE 
    WHEN e.max_participants IS NOT NULL 
    THEN (COUNT(ep.id)::FLOAT / e.max_participants::FLOAT * 100)::INTEGER
    ELSE NULL
  END as participation_percentage
FROM events e
LEFT JOIN event_participations ep ON e.id = ep.event_id
GROUP BY e.id, e.title, e.max_participants;

-- 参加者の詳細情報を取得するビュー
CREATE OR REPLACE VIEW event_participants_detail AS
SELECT 
  ep.id,
  ep.event_id,
  ep.user_id,
  ep.joined_at,
  u.display_name,
  u.avatar_url
FROM event_participations ep
LEFT JOIN users u ON ep.user_id = u.id
ORDER BY ep.joined_at DESC;

-- 通知が必要なイベントを取得するビュー（今後の実装用）
CREATE OR REPLACE VIEW upcoming_event_notifications AS
SELECT 
  e.id as event_id,
  e.title,
  e.start_date,
  un.user_id,
  un.enabled,
  un.notification_times,
  u.display_name
FROM events e
JOIN user_notifications un ON e.id = un.event_id
JOIN users u ON un.user_id = u.id
WHERE e.start_date > NOW() 
  AND un.enabled = true
ORDER BY e.start_date ASC;
