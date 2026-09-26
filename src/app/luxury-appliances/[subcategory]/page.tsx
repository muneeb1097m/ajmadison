import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

interface Props {
  params: Promise<{ subcategory: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const cat = CATEGORIES['luxury-appliances'];
  const sub = cat.subcategories.find((s) => s.slug === subcategory);
  const title = sub ? `${sub.name} - Luxury Appliances | AJ Madison` : 'Luxury Appliances | AJ Madison';

  return {
    title,
    description: `Shop high-end ${sub ? sub.name.toLowerCase() : 'luxury appliances'} from Sub-Zero, Wolf, and Miele with white-glove installation and trade pricing at AJ Madison.`,
  };
}

export default async function LuxurySubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const category = CATEGORIES['luxury-appliances'];
  const products = getProductsByCategory('luxury-appliances');

  return (
    <CategoryView
      category={category}
      products={products}
      activeSubcategorySlug={subcategory}
    />
  );
}
