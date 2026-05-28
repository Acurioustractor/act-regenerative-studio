import {
  renderShareCard,
  SHARE_CARD_SIZE,
  SHARE_CARD_CONTENT_TYPE,
} from '@/lib/confessions/share-card';

export const size = SHARE_CARD_SIZE;
export const contentType = SHARE_CARD_CONTENT_TYPE;
export const alt = 'Confessions to Philanthropy: call the gold phone';

export default function OpengraphImage() {
  return renderShareCard('hook');
}
