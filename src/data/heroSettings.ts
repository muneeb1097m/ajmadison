export interface HeroSettings {
  tagline: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  cardBadge: string;
  cardImage: string;
  cardTitle: string;
  cardDescription: string;
  cardPrice: number;
  cardOriginalPrice: number;
}

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  tagline: 'Official Appliance Headquarters',
  headingPrefix: 'Save Up To',
  headingHighlight: '50% Off',
  headingSuffix: 'On Top Appliance Packages',
  description: "Shop America's largest selection of luxury kitchen suites, whisper-quiet dishwashers, high-efficiency laundry pairs, and exclusive closeouts.",
  primaryButtonText: 'Shop Closeout Deals',
  primaryButtonLink: '/closeout-deals',
  secondaryButtonText: 'Explore Kitchen Packages',
  secondaryButtonLink: '/kitchen-packages',
  cardBadge: 'Save $1,398',
  cardImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  cardTitle: 'Samsung 4-Piece Stainless Suite',
  cardDescription: 'French Door Fridge + Gas Range + 48 dBA Dishwasher + OTR Microwave',
  cardPrice: 2498,
  cardOriginalPrice: 3896,
};
