/*
  # Create vector similarity search function

  1. New Functions
    - `match_tasks` - Performs vector similarity search on tasks
      - Takes query embedding, match threshold, match count, and user_id
      - Returns tasks ordered by similarity
      - Only returns tasks belonging to the user
      - Filters by similarity threshold

  2. Security
    - Function respects user_id parameter to ensure users only see their own tasks
    - Works with existing RLS policies
*/

CREATE OR REPLACE FUNCTION match_tasks(
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  user_id uuid
)
RETURNS TABLE (
  id uuid,
  title text,
  priority text,
  status text,
  created_at timestamptz,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    tasks.id,
    tasks.title,
    tasks.priority,
    tasks.status,
    tasks.created_at,
    1 - (tasks.embedding <=> query_embedding) as similarity
  FROM tasks
  WHERE tasks.user_id = match_tasks.user_id
    AND tasks.embedding IS NOT NULL
    AND 1 - (tasks.embedding <=> query_embedding) > match_threshold
  ORDER BY tasks.embedding <=> query_embedding
  LIMIT match_count;
$$;
