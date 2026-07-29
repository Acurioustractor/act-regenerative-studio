/**
 * Theme Styles
 * Color definitions for project themes
 * Client-safe (no fs, no node modules)
 */

import type { ProjectTheme } from '@/data/projects';

export const themeStyles = {
  earth: {
    hero: 'from-[#F6F1E7] via-[#E6DCC4] to-[#D4C09F]',
    text: 'text-[var(--we-olive)]',
    accent: 'text-forest',
    accentBg: 'bg-forest',
    badge: 'bg-forest text-white',
    border: 'border-[#E1D3BA]',
    panel: 'bg-white/90',
    button: 'bg-forest text-white hover:bg-forest-deep',
    sub: 'text-[#2A2318]',
    gradient: 'from-forest to-forest-deep',
  },
  justice: {
    hero: 'from-[#0B1F2A] via-[#132F3C] to-[#1F3D4B]',
    text: 'text-white',
    accent: 'text-[#F4D04F]',
    accentBg: 'bg-[#F4D04F]',
    badge: 'bg-[#F4D04F] text-[#0B1F2A]',
    border: 'border-[#315060]',
    panel: 'bg-white/10',
    button: 'bg-[#F4D04F] text-[#0B1F2A] hover:bg-[#F7DE72]',
    sub: 'text-[#D6E2EA]',
    gradient: 'from-[#F4D04F] to-[#E6C030]',
  },
  goods: {
    hero: 'from-[#F2E8DB] via-[#E6D2BD] to-[#D2B49A]',
    text: 'text-[#3B2F28]',
    accent: 'text-[#A24A2E]',
    accentBg: 'bg-[#A24A2E]',
    badge: 'bg-[#A24A2E] text-white',
    border: 'border-[#D7C4AF]',
    panel: 'bg-white/90',
    button: 'bg-[#A24A2E] text-white hover:bg-[#8B3F28]',
    sub: 'text-[#2A2318]',
    gradient: 'from-[#A24A2E] to-[#8B3F28]',
  },
  valley: {
    hero: 'from-[#EDF3E4] via-[#D6E2C5] to-[#B8CEA7]',
    text: 'text-[var(--we-olive)]',
    accent: 'text-[#3D7A4D]',
    accentBg: 'bg-[#3D7A4D]',
    badge: 'bg-[#3D7A4D] text-white',
    border: 'border-[#C8D8B7]',
    panel: 'bg-white/90',
    button: 'bg-[#3D7A4D] text-white hover:bg-[#32623E]',
    sub: 'text-[#2A2318]',
    gradient: 'from-[#3D7A4D] to-[#32623E]',
  },
  harvest: {
    hero: 'from-[#FFF2D6] via-[#F5D8A9] to-[#E9BC7D]',
    text: 'text-[#3C2E24]',
    accent: 'text-[#B15B20]',
    accentBg: 'bg-[#B15B20]',
    badge: 'bg-[#B15B20] text-white',
    border: 'border-[#E6C7A2]',
    panel: 'bg-white/90',
    button: 'bg-[#B15B20] text-white hover:bg-[#964D1B]',
    sub: 'text-[#2A2318]',
    gradient: 'from-[#B15B20] to-[#964D1B]',
  },
} as const;

export type ThemeStyle = (typeof themeStyles)[ProjectTheme];
