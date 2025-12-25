-- Add Descript as a supported video platform

-- Drop existing constraint
ALTER TABLE video_embeds DROP CONSTRAINT IF EXISTS video_embeds_platform_check;

-- Add new constraint with Descript included
ALTER TABLE video_embeds ADD CONSTRAINT video_embeds_platform_check
  CHECK (platform IN ('youtube', 'vimeo', 'loom', 'descript', 'direct'));

COMMENT ON CONSTRAINT video_embeds_platform_check ON video_embeds IS 'Supports YouTube, Vimeo, Loom, Descript, and direct video files';
