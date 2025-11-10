/*
  # Add vector search capability to tasks table

  1. Changes to Tasks Table
    - Enable pgvector extension for vector similarity search
    - Add `embedding` column to store task embeddings (vector type with 384 dimensions)
    - Create index on embedding column for faster similarity searches

  2. Security
    - No changes to RLS policies needed
    - Existing policies still apply

  3. Notes
    - Embeddings will be generated using gte-small model (384 dimensions)
    - Vector similarity search will use cosine distance
*/

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS embedding vector(384);

CREATE INDEX IF NOT EXISTS tasks_embedding_idx ON tasks USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
