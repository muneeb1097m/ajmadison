export interface SavingsTier {
  discount: string;
  condition: string;
}

export interface HeroSettings {
  // Flash Sale Bar
  flashSaleActive: boolean;
  flashSaleBadge: string;
  flashSaleText: string;
  flashSaleButtonText: string;
  flashSaleButtonLink: string;
  flashSaleImage: string;

  // Main Banner: Left Column
  headingLine1: string;
  headingLine2: string;
  discountPrefix: string;
  discountValue: string;
  ctaText: string;
  ctaLink: string;

  // Main Banner: Center Frame
  centerImage: string;
  centerImageTag: string;
  centerLink: string;

  // Main Banner: Right Column (Tiered Savings)
  tierHeaderLine1: string;
  tierHeaderLine2: string;
  tiers: SavingsTier[];
  tierFootnote: string;

  // Legacy fields preserved for backward compatibility
  tagline?: string;
  headingPrefix?: string;
  headingHighlight?: string;
  headingSuffix?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  cardBadge?: string;
  cardImage?: string;
  cardTitle?: string;
  cardDescription?: string;
  cardPrice?: number;
  cardOriginalPrice?: number;
}

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  // Flash Sale Bar
  flashSaleActive: true,
  flashSaleBadge: 'FLASH SALE',
  flashSaleText: 'EXCLUSIVE LIMITED-TIME DEALS ONLY AT AJM',
  flashSaleButtonText: 'SHOP NOW',
  flashSaleButtonLink: '/closeout-deals',
  flashSaleImage: '/images/hero_flash_appliances.png',

  // Main Banner: Left Column
  headingLine1: 'New Season.',
  headingLine2: 'Fresh Savings.',
  discountPrefix: 'UP TO',
  discountValue: '50% OFF',
  ctaText: 'SHOP ALL DEALS NOW →',
  ctaLink: '/closeout-deals',

  // Main Banner: Center Frame
  centerImage: '/images/hero_center_kitchen.png',
  centerImageTag: "DESIGNER PICKS, BEST-SELLERS & WHAT'S NEW",
  centerLink: '/kitchen-packages',

  // Main Banner: Right Column (Tiered Savings)
  tierHeaderLine1: 'THE MORE YOU BUY,',
  tierHeaderLine2: 'THE MORE YOU SAVE™',
  tiers: [
    { discount: '$1,000 OFF', condition: 'WHEN YOU BUY 6' },
    { discount: '$800 OFF', condition: 'WHEN YOU BUY 5' },
    { discount: '$600 OFF', condition: 'WHEN YOU BUY 4' },
    { discount: '$400 OFF', condition: 'WHEN YOU BUY 3' },
    { discount: '$200 OFF', condition: 'WHEN YOU BUY 2' },
  ],
  tierFootnote: '*ON QUALIFYING ITEMS',

  // Legacy fallbacks
  tagline: 'Official Appliance Headquarters',
  headingPrefix: 'New Season.',
  headingHighlight: 'Fresh Savings.',
  headingSuffix: 'Up to 50% Off',
  description: "Shop America's largest selection of luxury kitchen suites, whisper-quiet dishwashers, and exclusive closeouts.",
  primaryButtonText: 'Shop All Deals Now',
  primaryButtonLink: '/closeout-deals',
  secondaryButtonText: 'Explore Kitchen Packages',
  secondaryButtonLink: '/kitchen-packages',
  cardBadge: 'Up to 50% Off',
  cardImage: '/images/hero_center_kitchen.png',
  cardTitle: 'Designer Kitchen Suites',
  cardDescription: 'Refrigeration + Pro Range + Whisper-Quiet Dishwasher',
  cardPrice: 2498,
  cardOriginalPrice: 3896,
};
