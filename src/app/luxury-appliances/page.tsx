import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

export const metadata: Metadata = {
  title: 'Luxury Appliances: Sub-Zero, Wolf, Miele & Thermador | AJ Madison',
  description:
    'Experience gourmet luxury culinary excellence. Built-in column refrigeration, professional dual-fuel ranges, and whisper dishwashers with white-glove delivery.',
};

export default function LuxuryAppliancesPage() {
  const category = CATEGORIES['luxury-appliances'];
  const products = getProductsByCategory('luxury-appliances');

  return <CategoryView category={category} products={products} />;
}
