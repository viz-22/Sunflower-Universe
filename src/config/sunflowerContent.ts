export type LoveLetterCategory =
  | 'Things I love about you'
  | 'Little reasons you make me smile'
  | 'Things I wish I could tell you'
  | "Open when you're sad"
  | 'Open when you miss me'
  | 'Open when you need a hug'
  | 'Open when you cannot sleep'
  | 'Open when you need a reminder of how special you are';

export interface LoveLetterItem {
  id: string;
  category: LoveLetterCategory;
  title: string;
  salutation: string;
  body: string;
  closing: string;
  isCustom?: boolean;
}

export interface GardenFlowerMessage {
  id: number;
  title: string;
  message: string;
  signature: string;
}

export interface PolaroidMemory {
  id: string;
  imageSrc: string | null;
  caption: string;
  quote: string;
  hiddenMessage: string;
  dateLabel: string;
  tiltDeg: number;
  isUploadSlot?: boolean;
}

export interface MusicTrack {
  id: string;
  category: 'Golden Hour' | 'Little Happiness' | 'Rainy Days' | 'Dream With Me' | 'Just Us';
  title: string;
  subtitle: string;
  durationLabel: string;
  tempoBpm: number;
  notes: number[];
  padChord: number[];
  timbre: 'warm-piano' | 'acoustic-harp' | 'rain-piano' | 'dream-pad' | 'music-box';
}

export interface SecretSurpriseDef {
  id: string;
  title: string;
  locationLabel: string;
  hint: string;
  message: string;
  isGoldenSeed?: boolean;
}

export const SUNFLOWER_CONTENT = {
  brand: {
    name: 'SUNFLOWER',
    tagline: 'A Little Universe of You',
    philosophy: 'Some people receive flowers. She gets an entire universe of them.',
  },
  opening: {
    promptHint: 'Tap the sunflower he is holding',
    title: 'Hey, beautiful.',
    paragraphs: [
      'I made something for you.',
      "It's a little world filled with sunshine, flowers, little surprises and everything I wish I could give you.",
      'Come, let me show you.',
    ],
    enterButton: 'ENTER MY LITTLE WORLD 🌻',
  },
  portal: {
    title: 'A World Inside One Sunflower',
    message: [
      'Every flower has a little world inside it.',
      'And I think yours deserves to be explored.',
    ],
    hint: 'Find the giant sunflower in the centre of the meadow to step inside.',
  },
  unusualSunflower: {
    title: 'The Quiet Sunflower',
    paragraphs: [
      'Did you notice something?',
      'All these flowers are looking towards the sun.',
      "But this little one isn't.",
      "Maybe it's having a difficult day.",
      "Maybe it doesn't feel like blooming today.",
      "And that's okay.",
      "Even flowers deserve days when they don't have to be strong.",
      'And so do you.',
      "You don't have to smile every day.",
      "You don't have to pretend everything is okay.",
      "You don't have to be happy all the time.",
      'On your cloudy days, I hope you remember that you are still beautiful.',
      'And if the sunshine ever feels too far away, I hope I can be a little warmth beside you.',
      'You deserve love on your brightest days and your darkest ones.',
      'Always.',
    ],
    sunshineButton: 'LET ME GIVE YOU SOME SUNSHINE ☀️',
    afterSunshineNote: 'No hurry to bloom. I am right here beside you, in every weather.',
  },
  growGame: {
    completionLines: [
      'Look what you made grow.',
      'Some of the most beautiful things take patience, kindness and a little sunshine.',
      'Just like this little flower.',
    ],
  },
  finalScene: {
    heading: 'A Garden That Belongs To You',
    paragraphs: [
      'I could have bought you flowers.',
      'I could have sent you a bouquet.',
      'But I wanted to give you something that would stay a little longer.',
      'So I made you a little universe.',
      "A place where you can come whenever you need a smile, a little warmth or a reminder that you're special.",
      'And if you ever forget how beautiful you are, come back here.',
      'There will always be a sunflower waiting for you.',
      'With all my love. 🌻',
    ],
    returnButton: 'VISIT OUR LITTLE WORLD AGAIN',
  },
  petalCompliments: [
    'Your laugh is my favourite sound in any room.',
    'You carry a warmth that makes people feel instantly safe.',
    'Even the smallest detail you notice makes the day richer.',
    'You are softer, braver, and kinder than you even realise.',
    'Being near you feels like golden hour at the end of a long week.',
    'The way your eyes light up when you talk about things you love is pure magic.',
  ],
  gardenFlowers: [
    {
      id: 0,
      title: 'Morning Light',
      message: 'You make ordinary days feel like sunshine.',
      signature: 'For your Tuesday mornings',
    },
    {
      id: 1,
      title: 'An Entire Universe',
      message:
        "If I could give you one flower every time I thought about you, you'd have an entire universe of them.",
      signature: 'Always on my mind',
    },
    {
      id: 2,
      title: 'Quiet Magic',
      message:
        "Some people make the world brighter just by being in it. You're one of them.",
      signature: 'A simple truth',
    },
    {
      id: 3,
      title: 'Gentle Reminder',
      message: "Here's a little reminder that somebody is thinking about you.",
      signature: 'Right now, in fact',
    },
    {
      id: 4,
      title: 'Soft Courage',
      message:
        'Thank you for being gentle with the world, even on the days when the world feels loud.',
      signature: 'I notice it every time',
    },
    {
      id: 5,
      title: 'Little Things',
      message:
        'I love the way you notice stray clouds, warm tea, and songs that match the weather.',
      signature: 'My favourite observer',
    },
    {
      id: 6,
      title: 'Homeward',
      message:
        'No matter how busy a day gets, talking to you always feels like taking off heavy shoes at the door.',
      signature: 'My favourite place',
    },
    {
      id: 7,
      title: 'Golden Hour',
      message:
        'If I could bottle the feeling of watching you smile, I would keep it in my coat pocket forever.',
      signature: 'Warmest memory',
    },
    {
      id: 8,
      title: 'Unfinished Stories',
      message:
        'My favourite part of every plan is knowing I get to tell you all about it—or better yet, live it beside you.',
      signature: 'Here for all of it',
    },
    {
      id: 9,
      title: 'Honey & Light',
      message:
        'You do not have to be extraordinary to be loved deeply—though somehow you manage to be both effortlessly.',
      signature: 'Always',
    },
    {
      id: 10,
      title: 'Raincheck',
      message:
        'Even on grey afternoons, your voice still sounds like sunlight coming through kitchen curtains.',
      signature: 'Whenever it rains',
    },
    {
      id: 11,
      title: 'Always Choosing You',
      message:
        'In a meadow of ten thousand bright blooms, my eyes would still look for yours first.',
      signature: 'Every single time',
    },
  ] as GardenFlowerMessage[],
  letterCategories: [
    'Things I love about you',
    'Little reasons you make me smile',
    'Things I wish I could tell you',
    "Open when you're sad",
    'Open when you miss me',
    'Open when you need a hug',
    'Open when you cannot sleep',
    'Open when you need a reminder of how special you are',
  ] as LoveLetterCategory[],
  initialLetters: [
    {
      id: 'letter-1',
      category: 'Things I love about you',
      title: 'The Kindness You Carry',
      salutation: 'Dearest you,',
      body: 'I love how deeply you care about the people around you, even in tiny unspoken ways—remembering small details, checking if someone got home safely, and making everyone feel heard.',
      closing: 'With all my admiration,',
    },
    {
      id: 'letter-2',
      category: 'Things I love about you',
      title: 'Your Real Laugh',
      salutation: 'My sunshine,',
      body: 'I love your unguarded laugh—the one that comes out before you have time to be polite. Every single time I hear it, the whole day instantly tilts toward brighter weather.',
      closing: 'Forever your biggest fan,',
    },
    {
      id: 'letter-3',
      category: 'Little reasons you make me smile',
      title: 'Small Habits & Soft Moments',
      salutation: 'Hey you,',
      body: 'You make me smile when you get excited explaining something you love, when you pause to admire a pretty sky, and when a message from you pops up right as I was already thinking about you.',
      closing: 'Smiling as I write this,',
    },
    {
      id: 'letter-4',
      category: 'Little reasons you make me smile',
      title: 'Midday Thought',
      salutation: 'Sweetheart,',
      body: 'Sometimes I catch myself grinning at nothing in the middle of an ordinary afternoon, and every single time it is because a tiny memory of you just wandered across my mind.',
      closing: 'Yours warmly,',
    },
    {
      id: 'letter-5',
      category: 'Things I wish I could tell you',
      title: 'More Often Than I Do',
      salutation: 'Dear heart,',
      body: 'I wish I could tell you more often how proud I am of the person you are becoming—how gracefully you keep showing up, learning, softening, and growing at your own quiet pace.',
      closing: 'Always in your corner,',
    },
    {
      id: 'letter-6',
      category: 'Things I wish I could tell you',
      title: 'What Your Presence Feels Like',
      salutation: 'To my favourite soul,',
      body: 'If you could see yourself for five minutes through my eyes, you would never doubt for a second how luminous, rare, and genuinely wonderful you are.',
      closing: 'Quietly yours,',
    },
    {
      id: 'letter-7',
      category: "Open when you're sad",
      title: 'For Cloudy Weather',
      salutation: 'My love,',
      body: 'You do not have to fix everything tonight or force a smile. Sit down, wrap up in something soft, breathe slowly, and let the day be heavy if it needs to be. I am right here, and nothing about a sad day makes you any less loved.',
      closing: 'Holding space for you,',
    },
    {
      id: 'letter-8',
      category: "Open when you're sad",
      title: 'Tomorrow Can Wait',
      salutation: 'Gentle soul,',
      body: 'Even sunflowers bow their heads when the sky turns grey. Rest your shoulders. Drink a glass of warm water. You are allowed to simply be cared for today.',
      closing: 'Right beside you,',
    },
    {
      id: 'letter-9',
      category: 'Open when you miss me',
      title: 'Across Any Distance',
      salutation: 'Whenever we are apart,',
      body: 'Look up at the same sky for a moment and remember that distance only measures miles, never closeness. Take a deep breath—I am probably thinking of you at this exact minute too.',
      closing: 'Counting down until next time,',
    },
    {
      id: 'letter-10',
      category: 'Open when you miss me',
      title: 'Pocket Note',
      salutation: 'Hey beautiful,',
      body: 'Close your eyes for three seconds and picture the warmest hug I owe you next time I see you. Keep this note tucked in your pocket until I can give you the real one.',
      closing: 'Missing you right back,',
    },
    {
      id: 'letter-11',
      category: 'Open when you need a hug',
      title: 'A Warm Paper Embrace',
      salutation: 'Come here,',
      body: 'If I were standing beside you right now, I would pull you close without saying a word, rest my chin gently near your shoulder, and stay there until your breathing slowed down and felt lighter.',
      closing: 'Sending the longest hug,',
    },
    {
      id: 'letter-12',
      category: 'Open when you need a hug',
      title: 'Warmth On Demand',
      salutation: 'Dearest,',
      body: 'Wrap a blanket tightly around your shoulders and pretend those are my arms keeping the chill out. You are safe, you are cherished, and you never have to carry the world alone.',
      closing: 'Always warm for you,',
    },
    {
      id: 'letter-13',
      category: 'Open when you cannot sleep',
      title: 'Under Quiet Stars',
      salutation: 'Midnight wanderer,',
      body: 'Let every unfinished worry wait until morning light. Unclench your jaw, drop your shoulders away from your ears, and imagine a quiet field of sunflowers sleeping beneath soft amber stars.',
      closing: 'Sweet dreams when they find you,',
    },
    {
      id: 'letter-14',
      category: 'Open when you cannot sleep',
      title: 'Count Petals, Not Worries',
      salutation: 'Late-night thinker,',
      body: 'Breathe in for four quiet counts, hold for two, breathe out for six. Everything you did today was enough. You can rest now; the sun will wait patiently for you.',
      closing: 'Goodnight, little star,',
    },
    {
      id: 'letter-15',
      category: 'Open when you need a reminder of how special you are',
      title: 'One In A Universe',
      salutation: 'To you, reading this,',
      body: 'There has never been anyone else with your exact laugh, your exact gentleness, or the way you make ordinary places feel enchanted. Never shrink yourself to fit an ordinary room—you were made of golden light.',
      closing: 'Never forget it,',
    },
    {
      id: 'letter-16',
      category: 'Open when you need a reminder of how special you are',
      title: 'My Favourite Constellation',
      salutation: 'Dear sunshine,',
      body: 'Somebody out there built an entire garden of sunflowers on the internet just to make sure you smiled today. Remember that whenever you wonder if you matter.',
      closing: 'Forever grateful for you,',
    },
  ] as LoveLetterItem[],
  initialMemories: [
    {
      id: 'mem-1',
      imageSrc: '/src/assets/images/sunflower_polaroid_golden_field_1795773133778.jpg',
      caption: 'Walking through a sunlit meadow together',
      quote: 'Every path feels softer when we take the long way round.',
      hiddenMessage: 'Secret note: I still remember the first time you smiled at me like this.',
      dateLabel: 'Golden Hour Illustration',
      tiltDeg: -2.5,
    },
    {
      id: 'mem-2',
      imageSrc: '/src/assets/images/sunflower_polaroid_bouquet_1795773134472.jpg',
      caption: 'A bouquet wrapped in linen & afternoon light',
      quote: 'For all the ordinary Tuesdays that deserve fresh flowers.',
      hiddenMessage: 'Secret note: One bouquet is never enough for someone like you.',
      dateLabel: 'Pressed Linen Sketch',
      tiltDeg: 2.1,
    },
    {
      id: 'mem-3',
      imageSrc: '/src/assets/images/sunflower_polaroid_starlight_1795773134593.jpg',
      caption: 'Fireflies keeping watch beneath the crescent moon',
      quote: 'Even after sunset, warmth remembers where to glow.',
      hiddenMessage: 'Secret note: You are my favourite person to talk to past midnight.',
      dateLabel: 'Twilight Keepsake',
      tiltDeg: -1.6,
    },
    {
      id: 'mem-4',
      imageSrc: '/src/assets/images/sunflower_polaroid_teacup_1795773133679.jpg',
      caption: 'Warm tea & an open notebook by the window',
      quote: 'Quiet mornings are my favourite chapter with you.',
      hiddenMessage: 'Secret note: Here is to a hundred slow mornings together.',
      dateLabel: 'Windowlight Study',
      tiltDeg: 1.8,
    },
    {
      id: 'mem-slot-1',
      imageSrc: null,
      caption: 'Our next favourite photograph goes here',
      quote: 'Upload a personal moment from your device to pin it onto our wall.',
      hiddenMessage: 'A blank frame waiting for a real memory we made together.',
      dateLabel: 'Personal Photo Slot 01',
      tiltDeg: -2.0,
      isUploadSlot: true,
    },
    {
      id: 'mem-slot-2',
      imageSrc: null,
      caption: 'Another little moment to keep forever',
      quote: 'Saved privately on this device—only for us.',
      hiddenMessage: 'Tap the upload button to place a real snapshot here.',
      dateLabel: 'Personal Photo Slot 02',
      tiltDeg: 2.4,
      isUploadSlot: true,
    },
  ] as PolaroidMemory[],
  musicTracks: [
    {
      id: 'track-1',
      category: 'Golden Hour',
      title: 'Honey on Windowpanes',
      subtitle: 'Warm felt piano & gentle amber pads',
      durationLabel: '03:18',
      tempoBpm: 72,
      notes: [523.25, 659.25, 783.99, 987.77, 783.99, 659.25],
      padChord: [261.63, 329.63, 392.0, 493.88],
      timbre: 'warm-piano',
    },
    {
      id: 'track-2',
      category: 'Little Happiness',
      title: 'Petals in the Breeze',
      subtitle: 'Soft cheerful acoustic harp arpeggios',
      durationLabel: '02:46',
      tempoBpm: 94,
      notes: [587.33, 659.25, 739.99, 880.0, 987.77, 880.0],
      padChord: [293.66, 369.99, 440.0],
      timbre: 'acoustic-harp',
    },
    {
      id: 'track-3',
      category: 'Rainy Days',
      title: 'Cloudy Afternoon Waltz',
      subtitle: 'Calming piano chords for quiet days',
      durationLabel: '03:42',
      tempoBpm: 62,
      notes: [440.0, 523.25, 659.25, 587.33, 523.25, 493.88],
      padChord: [220.0, 261.63, 329.63, 392.0],
      timbre: 'rain-piano',
    },
    {
      id: 'track-4',
      category: 'Dream With Me',
      title: 'Fireflies Above the Meadow',
      subtitle: 'Dreamy ambient shimmer & distant bells',
      durationLabel: '04:05',
      tempoBpm: 56,
      notes: [392.0, 493.88, 587.33, 739.99, 587.33, 493.88],
      padChord: [196.0, 246.94, 293.66, 369.99],
      timbre: 'dream-pad',
    },
    {
      id: 'track-5',
      category: 'Just Us',
      title: 'Your Hand in Mine',
      subtitle: 'Delicate music-box melody & warm hum',
      durationLabel: '03:12',
      tempoBpm: 68,
      notes: [523.25, 587.33, 659.25, 783.99, 880.0, 783.99],
      padChord: [261.63, 329.63, 440.0],
      timbre: 'music-box',
    },
  ] as MusicTrack[],
  surprises: [
    {
      id: 'surprise-butterfly',
      title: 'The Golden Butterfly',
      locationLabel: 'Main Sunflower Universe',
      hint: 'Click a fluttering golden butterfly drifting above the meadow.',
      message:
        'A butterfly whispered a secret: even on busy days, my favourite moments are always the quiet ones with you.',
    },
    {
      id: 'surprise-petal',
      title: 'Caught Falling Petal',
      locationLabel: 'Floating Across the Sky',
      hint: 'Click any drifting golden petal floating gently across the screen.',
      message: 'You caught a falling petal! Wishing you soft mornings and gentle evenings.',
    },
    {
      id: 'surprise-moon',
      title: 'Twilight Crescent Moon',
      locationLabel: 'Evening Sky in the Universe',
      hint: 'Switch the garden sky to Dusk / Evening and click the glowing moon.',
      message:
        'Even when the sun goes down and the field grows quiet, you are the brightest glow in my whole sky.',
    },
    {
      id: 'surprise-heart-flower',
      title: 'The Hidden Heart in the Grass',
      locationLabel: 'Secret Miniature Garden',
      hint: 'Look closely near the grass edge inside the Secret Garden inside the giant sunflower.',
      message:
        'You found the tiny heart tucked in the grass: a reminder that gentle care grows in the quietest corners.',
    },
    {
      id: 'surprise-seed-1',
      title: 'Golden Seed I',
      locationLabel: 'Main Sunflower Universe',
      hint: 'Look for a shimmering golden seed nestled in the corner of the Main Garden.',
      message: 'First Golden Seed found! Two more are waiting quietly around our little universe.',
      isGoldenSeed: true,
    },
    {
      id: 'surprise-seed-2',
      title: 'Golden Seed II',
      locationLabel: 'Love Letter Garden',
      hint: 'Check near the garden soil beneath the letter stems in the Love Letter Garden.',
      message: 'Second Golden Seed found! Only one more golden seed left to unlock the secret letter.',
      isGoldenSeed: true,
    },
    {
      id: 'surprise-seed-3',
      title: 'Golden Seed III',
      locationLabel: 'Sunflower Memory Wall',
      hint: 'Peek along the bottom ribbon corner of the Sunflower Memory Wall.',
      message: 'Third Golden Seed found! Your Secret Three-Seed Letter is now unlocked in Surprises.',
      isGoldenSeed: true,
    },
    {
      id: 'surprise-gardener',
      title: "The Gardener's Keepsake",
      locationLabel: 'Grow Your Own Sunflower',
      hint: 'Plant, water, shine sunlight on, and name your own sunflower until it blooms.',
      message:
        'Every time you care for something small with patience, you remind the world how gentle love works.',
    },
  ] as SecretSurpriseDef[],
  secretThreeSeedsLetter: {
    title: 'The Secret Three-Seed Letter',
    salutation: 'My clever explorer,',
    body: 'You found all three hidden golden seeds scattered across our universe. Just like you noticed every tiny glimmer here, thank you for noticing the quiet effort, the soft jokes, and all the love woven into ordinary days. If I had to build a hundred little worlds from scratch just to see your eyes light up like this, I would start planting seeds all over again.',
    closing: 'Forever yours, in every secret corner 🌻',
  },
};
