import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

export const metadata: Metadata = {
  title: 'Small Appliances: Espresso Machines, Mixers & Blenders | AJ Madison',
  description:
    'Shop premium countertop appliances from Breville, KitchenAid, Vitamix, and Panasonic. Barista espresso machines, iconic stand mixers, and speed ovens.',
};

export default function SmallAppliancesPage() {
  const category = CATEGORIES['small-appliances'];
  const products = getProductsByCategory('small-appliances');

  return <CategoryView category={category} products={products} />;
}
