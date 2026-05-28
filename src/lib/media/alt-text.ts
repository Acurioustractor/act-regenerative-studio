const MEDIA_EXTENSION_PATTERN = /\.(jpe?g|png|webp|gif|mp4|mov|webm)$/i;

export function isWeakMediaAlt(value: string | null | undefined): boolean {
  const trimmed = value?.trim();
  if (!trimmed) return true;

  const withoutKind = trimmed
    .replace(/^(Image|Video|Photo):\s*/i, '')
    .trim();

  if (!withoutKind) return true;
  if (MEDIA_EXTENSION_PATTERN.test(withoutKind)) return true;
  if (/^(image|photo|field photo|media item|hero image|selected image|current hero image)$/i.test(withoutKind)) {
    return true;
  }
  if (/^(img|dsc|pxl)[-_ ]?\d+/i.test(withoutKind)) return true;
  if (/^[a-f0-9]{10,}[_-]/i.test(withoutKind)) return true;
  if (/low[-_ ]?res/i.test(withoutKind) && MEDIA_EXTENSION_PATTERN.test(withoutKind)) {
    return true;
  }

  return false;
}

export function cleanMediaAlt(
  value: string | null | undefined,
  fallback?: string
): string | undefined {
  const trimmed = value?.trim();
  const withoutKind = trimmed
    ?.replace(/^(Image|Video|Photo):\s*/i, '')
    .trim();

  if (withoutKind && !isWeakMediaAlt(withoutKind)) {
    return withoutKind;
  }

  return fallback?.trim() || undefined;
}
