import { ImageResponse } from 'next/og';

// Shared renderer for the Confessions to Philanthropy share cards. Used by the
// /confessions opengraph-image and the three stable share-card URLs under
// /confessions/share/<variant>. Styles are kept inside the Satori-safe subset
// (inline styles, explicit display:flex, no symbol glyphs, no gradients) so the
// cards render the same at build time and on request.

export const SHARE_CARD_SIZE = { width: 1200, height: 630 };
export const SHARE_CARD_CONTENT_TYPE = 'image/png';

export type ShareCardVariant = 'hook' | 'answer' | 'invite';
export const SHARE_CARD_VARIANTS: ShareCardVariant[] = ['hook', 'answer', 'invite'];

const NUMBER = '+61 (0) 2 8503 4273';
const ESPRESSO = '#15100A';
const GOLD = '#CFA16B';
const CREAM = '#F3EBDD';
const SAND = '#D8CBB6';

const variants: Record<
  ShareCardVariant,
  { kicker: string; headline: string; sub: string }
> = {
  hook: {
    kicker: 'Confessions to Philanthropy',
    headline: 'Tell philanthropy what you really think.',
    sub: `Call the gold phone.  ${NUMBER}`,
  },
  answer: {
    kicker: 'Confessions to Philanthropy',
    headline: '“We needed the grant, so I said nothing.”',
    sub: 'Confess anonymously. Then see what we build instead.',
  },
  invite: {
    kicker: 'Queensland Philanthropy Week',
    headline: 'Call the gold phone.',
    sub: `Anonymous. No consequences.  ${NUMBER}`,
  },
};

export function isShareCardVariant(value: string): value is ShareCardVariant {
  return (SHARE_CARD_VARIANTS as string[]).includes(value);
}

export function renderShareCard(variant: ShareCardVariant): ImageResponse {
  const v = variants[variant];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '76px',
          backgroundColor: ESPRESSO,
          color: CREAM,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top rule + kicker */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '88px', height: '4px', backgroundColor: GOLD }} />
          <div
            style={{
              display: 'flex',
              marginTop: '28px',
              fontSize: '24px',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              color: GOLD,
            }}
          >
            {v.kicker}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            fontSize: variant === 'answer' ? '64px' : '72px',
            fontWeight: 600,
            lineHeight: 1.05,
            maxWidth: '1000px',
            color: CREAM,
          }}
        >
          {v.headline}
        </div>

        {/* Sub + wordmark */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', fontSize: '30px', color: SAND, maxWidth: '760px' }}>
            {v.sub}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: GOLD,
            }}
          >
            A Curious Tractor
          </div>
        </div>
      </div>
    ),
    { ...SHARE_CARD_SIZE }
  );
}
