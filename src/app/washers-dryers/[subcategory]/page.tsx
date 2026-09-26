import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

interface Props {
  params: Promise<{ subcategory: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const cat = CATEGORIES['washers-dryers'];
  const sub = cat.subcategories.find((s) => s.slug === subcategory);
  const title = sub ? `${sub.name} - Washers & Dryers | AJ Madison` : 'Washers & Dryers | AJ Madison';

  return {
    title,
    description: `Shop high-efficiency ${sub ? sub.name.toLowerCase() : 'laundry appliances'} with free nationwide delivery and factory authorized warranties at AJ Madison.`,
  };
}

export default async function WasherSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const category = CATEGORIES['washers-dryers'];
  const products = getProductsByCategory('washers-dryers');

  return (
    <CategoryView
      category={category}
      products={products}
      activeSubcategorySlug={subcategory}
    />
  );
}
