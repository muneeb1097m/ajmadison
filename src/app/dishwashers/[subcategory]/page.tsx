import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

interface Props {
  params: Promise<{ subcategory: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const cat = CATEGORIES['dishwashers'];
  const sub = cat.subcategories.find((s) => s.slug === subcategory);
  const title = sub ? `${sub.name} - Dishwashers | AJ Madison` : 'Dishwashers | AJ Madison';

  return {
    title,
    description: `Shop whisper-quiet ${sub ? sub.name.toLowerCase() : 'dishwashers'} with premium stainless interiors and flexible 3rd racks at AJ Madison.`,
  };
}

export default async function DishwasherSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const category = CATEGORIES['dishwashers'];
  const products = getProductsByCategory('dishwashers');

  return (
    <CategoryView
      category={category}
      products={products}
      activeSubcategorySlug={subcategory}
    />
  );
}
