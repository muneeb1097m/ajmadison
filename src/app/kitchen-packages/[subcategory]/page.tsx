import React from 'react';
import type { Metadata } from 'next';
import CategoryView from '@/components/CategoryView';
import { CATEGORIES, getProductsByCategory } from '@/data/products';

interface Props {
  params: Promise<{ subcategory: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategory } = await params;
  const cat = CATEGORIES['kitchen-packages'];
  const sub = cat.subcategories.find((s) => s.slug === subcategory);
  const title = sub ? `${sub.name} - Kitchen Packages | AJ Madison` : 'Kitchen Packages | AJ Madison';

  return {
    title,
    description: `Discover coordinated ${sub ? sub.name.toLowerCase() : 'kitchen appliance packages'} with bundle savings up to $1,500+ and free nationwide delivery at AJ Madison.`,
  };
}

export default async function KitchenPackageSubcategoryPage({ params }: Props) {
  const { subcategory } = await params;
  const category = CATEGORIES['kitchen-packages'];
  const products = getProductsByCategory('kitchen-packages');

  return (
    <CategoryView
      category={category}
      products={products}
      activeSubcategorySlug={subcategory}
    />
  );
}
