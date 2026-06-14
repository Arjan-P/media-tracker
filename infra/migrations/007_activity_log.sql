CREATE TYPE activity_type AS ENUM (
  'added',
  'status_changed',
  'rated',
  'reviewed',
  'progress_updated',
  'removed'
);

CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_item_id UUID REFERENCES media_items(id) ON DELETE SET NULL,
    user_media_id UUID,
    type activity_type NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX inx_activity_log_user_created ON activity_log (user_id, created_at DESC);
