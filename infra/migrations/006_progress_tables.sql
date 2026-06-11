-- Books: page progress
CREATE TABLE book_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_media_id    UUID NOT NULL REFERENCES user_media(id) ON DELETE CASCADE,
  current_page     INT NOT NULL CHECK (current_page >= 0),
  total_pages      INT NOT NULL CHECK (total_pages > 0),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT book_progress_unique UNIQUE (user_media_id)
);

-- TV: episode tracking
CREATE TABLE tv_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_media_id    UUID NOT NULL REFERENCES user_media(id) ON DELETE CASCADE,
  current_season   SMALLINT NOT NULL DEFAULT 1 CHECK (current_season >= 1),
  current_episode  SMALLINT NOT NULL DEFAULT 1 CHECK (current_episode >= 1),
  total_seasons    SMALLINT,         -- nullable: ongoing shows
  total_episodes   SMALLINT,         -- nullable: ongoing shows
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tv_progress_unique UNIQUE (user_media_id)
);

-- Games: time-based
CREATE TABLE game_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_media_id    UUID NOT NULL REFERENCES user_media(id) ON DELETE CASCADE,
  hours_played     NUMERIC(6, 1) NOT NULL DEFAULT 0 CHECK (hours_played >= 0),
  completion_pct   SMALLINT CHECK (completion_pct BETWEEN 0 AND 100),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT game_progress_unique UNIQUE (user_media_id)
);

-- Anime: episode tracking (same shape as TV but separate — different data source)
CREATE TABLE anime_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_media_id    UUID NOT NULL REFERENCES user_media(id) ON DELETE CASCADE,
  current_episode  SMALLINT NOT NULL DEFAULT 1 CHECK (current_episode >= 1),
  total_episodes   SMALLINT,         -- nullable: airing
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT anime_progress_unique UNIQUE (user_media_id)
);

-- Manga: chapter + volume
CREATE TABLE manga_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_media_id    UUID NOT NULL REFERENCES user_media(id) ON DELETE CASCADE,
  current_chapter  INT NOT NULL DEFAULT 1 CHECK (current_chapter >= 1),
  current_volume   SMALLINT,
  total_chapters   INT,
  total_volumes    SMALLINT,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT manga_progress_unique UNIQUE (user_media_id)
);

-- Movies: no incremental progress — just watched/not watched
-- user_media.status handles this entirely, no extra table needed
