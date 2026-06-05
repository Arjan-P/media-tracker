CREATE TYPE media_type AS ENUM ('movie', 'tv', 'game', 'book', 'anime', 'manga');

CREATE TABLE media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,

    type media_type NOT NULL,

    name TEXT NOT NULL,
    description TEXT,

    cover_url TEXT,

    release_date DATE,

    meta JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Creating composite unique
    CONSTRAINT media_items_provider_provider_id_unique
        UNIQUE (provider, provider_id)
);

