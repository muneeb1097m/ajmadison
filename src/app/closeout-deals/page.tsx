import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, PRODUCTS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Closeout Deals & Warehouse Clearance | AJ Madison',
  description:
    'Save up to 50% on top brand closeout appliances, scratch-and-dent specials, open box suites, and manufacturer rebates with fast nationwide delivery.',
};

export default function CloseoutDealsPage() {
  const category = CATEGORIES['closeout-deals'];
  const products = PRODUCTS.filter((p) => p.isCloseout);

  return <CategoryView category={category} products={products} />;
}
