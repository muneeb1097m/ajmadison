import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

export const metadata: Metadata = {
  title: 'Washers & Dryers: Front Load, Top Load & Stacked Pairs | AJ Madison',
  description:
    'Shop washers and dryers from LG, Electrolux, Speed Queen, and Samsung. Find stackable sets, smart TurboWash models, and sanitized steam dryers.',
};

export default function WashersDryersPage() {
  const category = CATEGORIES['washers-dryers'];
  const products = getProductsByCategory('washers-dryers');

  return <CategoryView category={category} products={products} />;
}
