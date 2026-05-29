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

/** Whether a confession's actual recording is cleared for public playback.
 *  'cleared' = the caller consented to their VOICE being played AND the audio
 *  carries no identifying detail. 'text-only' (default) publishes the words
 *  only, rendered exactly as before (decorative waveform, no audio). */
export type ConfessionAudioStatus = 'cleared' | 'text-only';

export interface Confession {
  id: string;
  /** Anonymised transcript. "█" runs are removed identifying details. */
  text: string;
  theme: ConfessionTheme;
  /** Call length in seconds, shown like a voicemail duration. */
  durationSeconds: number;
  /** Omit => treated as 'text-only'. 'cleared' shows a real play button + plays audioSrc. */
  audioStatus?: ConfessionAudioStatus;
  /** Static path under /public to the cleared clip, e.g. '/confessions/audio/c02.mp3'. */
  audioSrc?: string;
  /** Short note shown on a text-only row, e.g. "Shared as words, by the caller's choice." */
  consentNote?: string;
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
    consentNote: 'Shared as words.',
    text: 'Hi! I wish there was more money, I wish there was money for everything. In the meantime, keep doing the good work that you’re doing, and keep sharing the stories because hopefully that will inspire others.',
  },
  {
    id: 'c02',
    theme: 'power',
    durationSeconds: 24,
    audioStatus: 'cleared',
    audioSrc: '/confessions/audio/c02.mp3',
    text: "Hello, this is a message for philanthropy. I just think you've got a really difficult job, and you do it really difficultly. I think if you just gave up on thinking that you knew what you were doing, then you'd actually do a much better job. Just give the money to the people who actually know what is going on, and then you might actually have a better job. That's all.",
  },
  {
    id: 'c03',
    theme: 'money',
    durationSeconds: 28,
    audioStatus: 'cleared',
    audioSrc: '/confessions/audio/c03.mp3',
    text: "My confession is, please just ask us. Genuinely ask. Not with a corporate brochure or a glossy annual report. Tell us about the people, the animals, the places, the ecosystems you're actually saving. Show us the real story. Not talk about the organisation. And please don't be shy about it. When you make the ask human and honest, the answer is always yes.",
  },
  {
    id: 'c04',
    theme: 'hope',
    durationSeconds: 79,
    audioStatus: 'cleared',
    audioSrc: '/confessions/audio/c04.mp3',
    text: "So, my confession. It's not really a confession. It's to say that I wish you didn't have to exist. I'm incredibly thankful that there are people who believe in philanthropy and put time and effort and soul into it. Our society benefits so hugely from it. But I wish you didn't have to exist. I wish we lived in a world where capitalism didn't drive us, where governments were able to support everyone, where equity was just a given. But it's not. And so, until then, we have amazing philanthropic organisations and givers and providers, those who pour their heart and soul into ensuring our world is still providing the best opportunity to those who don't have it. So I guess, yeah, my takeaway is just a huge thank you. But I wish you didn't have to exist. I love this idea, and love following all of those that are in the post. So thank you. Thank you, and keep being inspiring.",
  },
  {
    id: 'c05',
    theme: 'money',
    durationSeconds: 31,
    consentNote: 'Shared as words.',
    text: "Philanthropy is the practice of giving time, money or resources to help others and benefit society. The word actually comes from the Greek, meaning love of humanity. Whilst the concept has existed over millennia, in many, many different cultures, I think it's lost its way a little bit, in that it tends to be about money now.",
  },
  {
    id: 'c06',
    theme: 'hope',
    durationSeconds: 29,
    audioStatus: 'cleared',
    audioSrc: '/confessions/audio/c06.mp3',
    text: "I wish that I could do more. I love working in this sector, being able to make a change. But I also hate it, because it's opened my eyes up to this huge, gigantic need. And I struggle to sleep every night, knowing that while I'm making a difference, it's only a very small drop in a very big ocean.",
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
