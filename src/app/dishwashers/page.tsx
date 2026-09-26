import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

export const metadata: Metadata = {
  title: 'Dishwashers: Quiet Built-In, Panel Ready & Drawers | AJ Madison',
  description:
    'Discover top-rated dishwashers from Bosch, Miele, and KitchenAid. Quiet 38-44 dBA models with CrystalDry, flexible 3rd racks, and custom panel options.',
};

export default function DishwashersPage() {
  const category = CATEGORIES['dishwashers'];
  const products = getProductsByCategory('dishwashers');

  return <CategoryView category={category} products={products} />;
}
