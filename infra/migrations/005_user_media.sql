-- Per-user tracking
CREATE TYPE media_status AS ENUM (
  'planned',      -- Added, not started
  'in_progress',  -- Currently watching/reading/playing
  'completed',    -- Finished
  'dropped'       -- Abandoned
);

CREATE TABLE user_media (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_item_id   UUID NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,

  status          media_status NOT NULL DEFAULT 'planned',

  rating          SMALLINT CHECK (rating BETWEEN 1 AND 10),
  review          TEXT,

  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT user_media_unique UNIQUE (user_id, media_item_id)
);
