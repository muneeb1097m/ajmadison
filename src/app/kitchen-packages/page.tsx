import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

export const metadata: Metadata = {
  title: 'Kitchen Packages: 4-Piece, 3-Piece & Luxury Suites | AJ Madison',
  description:
    'Bundle and save on matching kitchen appliance suites from Samsung, Bosch, GE Profile, and Thermador. Free nationwide delivery on all full kitchen packages.',
};

export default function KitchenPackagesPage() {
  const category = CATEGORIES['kitchen-packages'];
  const products = getProductsByCategory('kitchen-packages');

  return <CategoryView category={category} products={products} />;
}
