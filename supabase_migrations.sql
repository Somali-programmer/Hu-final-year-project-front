-- Run these commands in your Supabase SQL Editor to update your database schema

-- 1. Add description to centers
ALTER TABLE centers ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Add description to programs
ALTER TABLE programs ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Add center_id reference to batches
ALTER TABLE batches ADD COLUMN IF NOT EXISTS center_id UUID REFERENCES centers(id);

-- Optional: If you want to seed a 2023 Batch for both Regular and Extension:
-- Note: Replace the program_id and center_id with actual UUIDs from your tables.
/*
INSERT INTO batches (name, entry_year, current_year, current_semester, expected_graduation, program_id, center_id)
VALUES 
  ('2023 Batch (Regular)', 2023, 1, 1, '2027', '<insert-regular-program-uuid-here>', NULL),
  ('2023 Batch (Extension)', 2023, 1, 1, '2027', '<insert-extension-program-uuid-here>', '<insert-center-uuid-here>');
*/
