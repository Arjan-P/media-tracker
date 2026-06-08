CREATE TYPE media_provider AS ENUM (
    'tmdb',
    'igdb',
    'openlibrary',
    'jikan'
);

ALTER TABLE media_items
ALTER COLUMN provider TYPE media_provider
USING provider::media_provider;
