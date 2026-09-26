import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

interface Props {
  params: Promise<{ subcategory: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const cat = CATEGORIES['small-appliances'];
  const sub = cat.subcategories.find((s) => s.slug === subcategory);
  const title = sub ? `${sub.name} - Small Appliances | AJ Madison` : 'Small Appliances | AJ Madison';

  return {
    title,
    description: `Shop high-performance ${sub ? sub.name.toLowerCase() : 'countertop appliances'} from Breville, Vitamix, and KitchenAid with fast delivery at AJ Madison.`,
  };
}

export default async function SmallApplianceSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const category = CATEGORIES['small-appliances'];
  const products = getProductsByCategory('small-appliances');

  return (
    <CategoryView
      category={category}
      products={products}
      activeSubcategorySlug={subcategory}
    />
  );
}
