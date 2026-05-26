// MOCK confessions for testing the /confessions experience before the real
// Dialpad pipeline is live. Shaped to match the eventual moderated output
// (Dialpad webhook -> strip caller-ID + PII -> human approval -> this shape)
// so it is a drop-in swap later. NOTHING here is a real message.
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

/** Flip to false the day real moderated confessions replace this. */
export const IS_MOCK = true;

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

/** Short, punchy lines for the hero catch-a-voice field (must read in 1-2 lines). */
export const heroFragments: string[] = [
  'You backed us when no one else would.',
  'We needed the grant, so I said nothing.',
  'Stop calling it a partnership.',
  'I cried in the car when it came through.',
  'We are still here.',
  'The work is so good.',
  'Why is it usually fourteen months?',
  'Do better.',
];

// What the hero catch-a-voice field surfaces: the brief's prompts and litany
// (real copy, not mock) mixed with the short fragments above. Lives here (a
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
  ...heroFragments,
];
