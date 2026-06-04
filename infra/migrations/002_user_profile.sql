ALTER TABLE users
ADD COLUMN first_name TEXT NOT NULL DEFAULT '',
ADD COLUMN last_name TEXT NOT NULL DEFAULT '';

-- remove defaults after existing rows are populated
ALTER TABLE users
ALTER COLUMN first_name DROP DEFAULT,
ALTER COLUMN last_name DROP DEFAULT;
