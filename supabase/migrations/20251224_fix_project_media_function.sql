-- Fix get_project_media function to handle potentially missing columns

CREATE OR REPLACE FUNCTION get_project_media(p_link_type TEXT, p_link_id TEXT)
RETURNS TABLE (
  id UUID,
  file_url TEXT,
  thumbnail_url TEXT,
  file_type TEXT,
  title TEXT,
  description TEXT,
  alt_text TEXT,
  caption TEXT,
  credit TEXT,
  width INTEGER,
  height INTEGER,
  blurhash TEXT,
  display_order INTEGER,
  is_hero BOOLEAN,
  is_featured BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.file_url,
    COALESCE(m.thumbnail_url, '') as thumbnail_url,
    m.file_type,
    COALESCE(m.title, '') as title,
    COALESCE(m.description, '') as description,
    COALESCE(pml.alt_text, m.alt_text, '') as alt_text,
    COALESCE(pml.caption, m.caption, '') as caption,
    COALESCE(m.credit, '') as credit,
    COALESCE(m.width, 0) as width,
    COALESCE(m.height, 0) as height,
    COALESCE(m.blurhash, '') as blurhash,
    COALESCE(pml.display_order, 0) as display_order,
    COALESCE(pml.is_hero, false) as is_hero,
    COALESCE(pml.is_featured, false) as is_featured
  FROM media_items m
  INNER JOIN project_media_links pml ON m.id = pml.media_id
  WHERE pml.link_type = p_link_type
    AND pml.link_id = p_link_id
  ORDER BY pml.is_hero DESC, pml.display_order ASC, m.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Also update get_hero_image function for consistency
CREATE OR REPLACE FUNCTION get_hero_image(p_link_type TEXT, p_link_id TEXT)
RETURNS TABLE (
  id UUID,
  file_url TEXT,
  thumbnail_url TEXT,
  title TEXT,
  alt_text TEXT,
  blurhash TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.file_url,
    COALESCE(m.thumbnail_url, '') as thumbnail_url,
    COALESCE(m.title, '') as title,
    COALESCE(pml.alt_text, m.alt_text, '') as alt_text,
    COALESCE(m.blurhash, '') as blurhash
  FROM media_items m
  INNER JOIN project_media_links pml ON m.id = pml.media_id
  WHERE pml.link_type = p_link_type
    AND pml.link_id = p_link_id
    AND pml.is_hero = true
  ORDER BY m.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Project media functions updated successfully!';
END $$;
