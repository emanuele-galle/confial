-- Add PostgreSQL full-text search infrastructure with Italian language stemming

-- Add search_vector columns to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('italian', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('italian', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('italian', coalesce(content, '')), 'C')
  ) STORED;

-- Add search_vector columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('italian', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('italian', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('italian', coalesce(location, '')), 'C')
  ) STORED;

-- Add search_vector columns to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('italian', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('italian', coalesce(description, '')), 'B')
  ) STORED;

-- Create GIN indices for fast full-text search
CREATE INDEX IF NOT EXISTS news_search_idx ON news USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS events_search_idx ON events USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS documents_search_idx ON documents USING GIN (search_vector);
