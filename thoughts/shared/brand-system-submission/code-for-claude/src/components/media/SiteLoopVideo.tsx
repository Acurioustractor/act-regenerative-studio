interface SiteLoopVideoProps {
  src: string;
  title: string;
  poster?: string | null;
  className?: string;
  preload?: 'none' | 'metadata' | 'auto';
}

export function SiteLoopVideo({
  src,
  title,
  poster = null,
  className = '',
  preload = 'metadata',
}: SiteLoopVideoProps) {
  return (
    <video
      src={src}
      poster={poster || undefined}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      aria-label={title}
      disablePictureInPicture
      controlsList="nodownload noplaybackrate nofullscreen"
    />
  );
}
