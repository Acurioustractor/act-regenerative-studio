// Confession data for the /confessions experience.
//
// `realConfessions` holds the messages we actually display: each one listened to
// by a human, stripped of identifying detail, and shared with the caller's
// consent. Add new cleared messages there. `mockConfessions` is the shaped
// sample set, shown only when IS_MOCK is true (local design/testing, never in
// production). Both match the eventual moderated output shape (Dialpad webhook
// -> strip caller-ID + PII -> human approval -> this shape) so the real pipeline
// is a drop-in later.
//
// Redaction convention: runs of "█" mark where a name or identifying detail
// was removed by the moderator. The wall renders those runs as redaction bars.

export type ConfessionTheme =
  | 'money'
  | 'power'
  | 'the forms'
  | 'shame'
  | 'hope'
  | 'breakthrough'
  | 'the weird';

export interface Confession {
  id: string;
  /** Anonymised transcript. "█" runs are removed identifying details. */
  text: string;
  theme: ConfessionTheme;
  /** Call length in seconds, shown like a voicemail duration. */
  durationSeconds: number;
}

/** True shows the sample set (mockConfessions) for local design work; false
 *  shows realConfessions, the consented messages. Live = false. */
export const IS_MOCK = false;

/** Theme display + a warm hue per theme (rgb triple) for the visualisations. */
export const themeMeta: Record<ConfessionTheme, { label: string; rgb: string }> = {
  money: { label: 'money', rgb: '207,161,107' },
  power: { label: 'power', rgb: '199,125,74' },
  'the forms': { label: 'the forms', rgb: '156,143,111' },
  shame: { label: 'shame', rgb: '181,97,90' },
  hope: { label: 'hope', rgb: '216,194,122' },
  breakthrough: { label: 'breakthrough', rgb: '224,185,133' },
  'the weird': { label: 'the weird', rgb: '143,155,118' },
};

export const themeOrder: ConfessionTheme[] = [
  'money',
  'power',
  'the forms',
  'shame',
  'hope',
  'breakthrough',
  'the weird',
];

export const mockConfessions: Confession[] = [
  {
    id: 'm01',
    theme: 'the forms',
    durationSeconds: 52,
    text: 'The reporting template has forty fields. We helped twelve people really well this year. Not one of those forty fields can hold what that actually looked like.',
  },
  {
    id: 'm02',
    theme: 'breakthrough',
    durationSeconds: 38,
    text: 'You backed us when no one else would. I still have the email that said yes. It changed everything.',
  },
  {
    id: 'm03',
    theme: 'power',
    durationSeconds: 71,
    text: 'I sat in a room where a funder explained our own community back to us. I said nothing. We needed the grant.',
  },
  {
    id: 'm04',
    theme: 'the forms',
    durationSeconds: 44,
    text: 'Why do you make us prove we are poor enough, and then prove we are capable enough, on the same form?',
  },
  {
    id: 'm05',
    theme: 'shame',
    durationSeconds: 63,
    text: "We got declined. No reason. No phone call. Just a portal that changed from 'under review' to 'unsuccessful'. Eight months of work.",
  },
  {
    id: 'm06',
    theme: 'money',
    durationSeconds: 29,
    text: 'The catering at the launch cost more than our entire volunteer budget for the year. I counted.',
  },
  {
    id: 'm07',
    theme: 'power',
    durationSeconds: 80,
    text: 'I am a program officer. I believe in this work. I also cannot say half of what I think without putting my job at risk.',
  },
  {
    id: 'm08',
    theme: 'money',
    durationSeconds: 47,
    text: 'You moved fast for us once. One phone call, money in the account within a week. So I know you can. Why is it usually fourteen months?',
  },
  {
    id: 'm09',
    theme: 'hope',
    durationSeconds: 35,
    text: 'Honestly? Thank you. We would not exist without you. I just wish you would come and see it sometime.',
  },
  {
    id: 'm10',
    theme: 'power',
    durationSeconds: 26,
    text: 'Stop calling it a partnership when only one of us is allowed to end it.',
  },
  {
    id: 'm11',
    theme: 'breakthrough',
    durationSeconds: 58,
    text: 'I cried in the car after the grant came through. Happy crying. First time in a long time that something felt possible.',
  },
  {
    id: 'm12',
    theme: 'the forms',
    durationSeconds: 49,
    text: 'I have spent more hours this year on acquittals than on the actual mission. I am so tired. The work is good though. The work is so good.',
  },
  {
    id: 'm13',
    theme: 'shame',
    durationSeconds: 66,
    text: 'A board member at █████████████ told me we were not investment ready. It took me a year to work out that just meant small, and new, and from the wrong postcode.',
  },
  {
    id: 'm14',
    theme: 'breakthrough',
    durationSeconds: 55,
    text: 'We were three weeks from closing the doors. The bridging grant came through on a Friday. We are still here. Hundreds of kids are still here.',
  },
  {
    id: 'm15',
    theme: 'hope',
    durationSeconds: 33,
    text: 'The best thing you ever did was not the money. It was that you listened first, and then you came back.',
  },
  {
    id: 'm16',
    theme: 'the weird',
    durationSeconds: 18,
    text: 'Sorry, wrong number, I was trying to reach the council about a pothole. But while I have you, philanthropy: do better.',
  },
];

/** Real, moderated confessions, the messages the inbox actually shows. Each one
 *  has been listened to by a human, had identifying detail removed, and is
 *  shared with the caller's consent. Add new cleared messages here. */
export const realConfessions: Confession[] = [
  {
    id: 'c01',
    theme: 'money',
    durationSeconds: 22,
    text: 'Hi! I wish there was more money, I wish there was money for everything. In the meantime, keep doing the good work that you’re doing, and keep sharing the stories because hopefully that will inspire others.',
  },
];

// What the hero catch-a-voice field surfaces: the campaign's own prompts and
// litany, real invitation copy, never a fabricated confession. Lives here (a
// plain module) so the server page can pass it into the client field without
// importing a value across the client boundary.
export const heroVoices: string[] = [
  'What do you wish philanthropy knew?',
  'What have you always wanted to tell it?',
  'What have you never confessed?',
  'The good.',
  'The weird.',
  'The messy.',
  'The hopeful.',
  'The bullshit.',
  'The breakthrough.',
  'Say the quiet bit out loud.',
  'You can be anonymous.',
  'Leave a message at the tone.',
];
