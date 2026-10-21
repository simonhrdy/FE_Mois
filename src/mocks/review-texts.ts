import { pick, type Random } from './random';

type Sentiment = 'negative' | 'neutral' | 'positive';

const OPENERS: Record<Sentiment, readonly string[]> = {
  negative: [
    'Really disappointed with this visit.',
    'I used to love this place, but not anymore.',
    'Not worth the money.',
    'Worst experience I have had in a long time.',
    'Hard to recommend after tonight.',
  ],
  neutral: [
    'Decent place, nothing special.',
    'It was okay overall.',
    'Mixed feelings about this one.',
    'Average experience, a few good moments.',
  ],
  positive: [
    'Absolutely loved it!',
    'One of the best spots in town.',
    'Great find, we will definitely be back.',
    'Fantastic experience from start to finish.',
    'Hidden gem, highly recommended.',
  ],
};

const FOOD_DETAILS: Record<string, Record<Sentiment, readonly string[]>> = {
  Pizza: {
    negative: [
      'The pizza arrived cold and the crust was soggy.',
      'Delivery took over an hour and the order was wrong.',
      'The toppings were sparse and the cheese tasted cheap.',
      'Since the new management the quality dropped a lot.',
      'The dough was undercooked in the middle.',
    ],
    neutral: [
      'The pizza was fine but a bit too salty.',
      'Crust was good, toppings were average.',
      'Portions are fair, prices slightly high for the Strip.',
    ],
    positive: [
      'Perfect thin crust with a nice char and fresh mozzarella.',
      'The pepperoni pizza is incredible and the garlic knots are a must.',
      'Wood-fired pizza done right, great sauce.',
      'Huge slices, great value and fast delivery.',
    ],
  },
  Italian: {
    negative: ['The pasta was overcooked and bland.', 'We waited 40 minutes for our mains.'],
    neutral: ['The lasagna was decent, the tiramisu forgettable.'],
    positive: ['Homemade pasta and an excellent wine list.', 'The carbonara is the real deal.'],
  },
  Burgers: {
    negative: ['My burger was dry and the fries were stale.'],
    neutral: ['Good burger, nothing memorable.'],
    positive: ['Juicy burgers and amazing milkshakes.'],
  },
};

const SERVICE: Record<Sentiment, readonly string[]> = {
  negative: [
    'Staff seemed overwhelmed and nobody checked on us.',
    'The cashier was rude when we asked about our order.',
    'Tables were dirty and the restroom was a mess.',
  ],
  neutral: ['Service was slow but friendly.', 'A bit noisy on a Friday night.'],
  positive: [
    'Our server was attentive and super friendly.',
    'Quick service even though it was packed.',
    'Clean, cozy and welcoming atmosphere.',
  ],
};

function sentimentOf(stars: number): Sentiment {
  if (stars <= 2) return 'negative';
  if (stars === 3) return 'neutral';
  return 'positive';
}

export function generateReviewText(random: Random, stars: number, category: string): string {
  const sentiment = sentimentOf(stars);
  const details = FOOD_DETAILS[category] ?? FOOD_DETAILS.Pizza;
  const food = details?.[sentiment] ?? [];
  const sentences = [pick(random, OPENERS[sentiment])];
  if (food.length > 0) sentences.push(pick(random, food));
  if (random() > 0.35) sentences.push(pick(random, SERVICE[sentiment]));
  return sentences.join(' ');
}

const FIRST_NAMES = [
  'Ashley',
  'Brian',
  'Carlos',
  'Diana',
  'Ethan',
  'Fatima',
  'Grace',
  'Hiro',
  'Isabel',
  'Jamal',
  'Kate',
  'Liam',
  'Maria',
  'Noah',
  'Olivia',
  'Priya',
  'Quinn',
  'Rosa',
  'Sam',
  'Tina',
  'Victor',
  'Wendy',
  'Xavier',
  'Yuki',
  'Zoe',
] as const;

export function generateUserName(random: Random): string {
  const initial = String.fromCharCode(65 + Math.floor(random() * 26));
  return `${pick(random, FIRST_NAMES)} ${initial}.`;
}
