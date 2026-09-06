// Single source of truth for the Confessions to Philanthropy phone line.
// Used on /confessions and the homepage campaign band. Server-safe (no client
// hooks) so it can render inside server components.

export const DISPLAY_NUMBER = '+61 (0) 2 8503 4273';
export const TEL = 'tel:+61285034273';

export function CallCTA({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  return (
    <a
      href={TEL}
      className={`group inline-flex items-center gap-3 rounded-full bg-[var(--warm-gold)] font-semibold text-[#1A130B] transition-all hover:gap-4 hover:bg-[#E0B985] ${
        size === 'lg' ? 'px-7 py-4 text-base' : 'px-5 py-3 text-sm'
      }`}
    >
      <span aria-hidden="true">☎</span>
      <span>Call</span>
      <span className="font-mono tracking-[0.04em] tabular-nums">{DISPLAY_NUMBER}</span>
    </a>
  );
}
