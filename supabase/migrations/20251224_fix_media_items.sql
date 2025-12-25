-- Fix Media Items Table - Add Missing Columns
-- Run this FIRST if you're getting "column does not exist" errors

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add source column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='source') THEN
    ALTER TABLE media_items ADD COLUMN source TEXT;
    RAISE NOTICE 'Added source column';
  END IF;

  -- Add source_id column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='source_id') THEN
    ALTER TABLE media_items ADD COLUMN source_id TEXT;
    RAISE NOTICE 'Added source_id column';
  END IF;

  -- Add manual_tags column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='manual_tags') THEN
    ALTER TABLE media_items ADD COLUMN manual_tags TEXT[] DEFAULT '{}';
    RAISE NOTICE 'Added manual_tags column';
  END IF;

  -- Add impact_themes column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='impact_themes') THEN
    ALTER TABLE media_items ADD COLUMN impact_themes TEXT[] DEFAULT '{}';
    RAISE NOTICE 'Added impact_themes column';
  END IF;

  -- Add project_slugs column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='project_slugs') THEN
    ALTER TABLE media_items ADD COLUMN project_slugs TEXT[] DEFAULT '{}';
    RAISE NOTICE 'Added project_slugs column';
  END IF;

  -- Add is_hero_image column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='is_hero_image') THEN
    ALTER TABLE media_items ADD COLUMN is_hero_image BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added is_hero_image column';
  END IF;

  -- Add credit column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='credit') THEN
    ALTER TABLE media_items ADD COLUMN credit TEXT;
    RAISE NOTICE 'Added credit column';
  END IF;

  -- Add caption column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='caption') THEN
    ALTER TABLE media_items ADD COLUMN caption TEXT;
    RAISE NOTICE 'Added caption column';
  END IF;

  -- Add blurhash column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='blurhash') THEN
    ALTER TABLE media_items ADD COLUMN blurhash TEXT;
    RAISE NOTICE 'Added blurhash column';
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='updated_at') THEN
    ALTER TABLE media_items ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column';
  END IF;

  -- Add created_by column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='media_items' AND column_name='created_by') THEN
    ALTER TABLE media_items ADD COLUMN created_by UUID REFERENCES auth.users(id);
    RAISE NOTICE 'Added created_by column';
  END IF;

  RAISE NOTICE 'All missing columns have been added to media_items table';
END $$;

-- Now you can run the full migration: 20251224_media_gallery_safe.sql
