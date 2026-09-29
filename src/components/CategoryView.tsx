'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import styles from './CategoryView.module.css';
import ProductCard from './ProductCard';
import { CategoryInfo, Product } from '@/data/products';
import CustomDropdown, { DropdownOption } from './CustomDropdown';

const SORT_OPTIONS: DropdownOption[] = [
  { value: 'featured', label: 'Featured / Best Match' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

interface CategoryViewProps {
  category: CategoryInfo;
  products: Product[];
  activeSubcategorySlug?: string;
}

export default function CategoryView({
  category,
  products,
  activeSubcategorySlug = 'all',
}: CategoryViewProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState(activeSubcategorySlug);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Extract all unique brands in this category
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Subcategory filter
      if (selectedSubcategory !== 'all') {
        const matchesSubcategory =
          product.subCategorySlug === selectedSubcategory ||
          (product.subCategories && product.subCategories.includes(selectedSubcategory)) ||
          (category.slug === 'closeout-deals' && product.category === selectedSubcategory);
        if (!matchesSubcategory) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // In-stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Price filter
      if (priceRange === 'under-1000' && product.price >= 1000) return false;
      if (priceRange === '1000-2000' && (product.price < 1000 || product.price > 2000)) return false;
      if (priceRange === '2000-5000' && (product.price < 2000 || product.price > 5000)) return false;
      if (priceRange === 'over-5000' && product.price <= 5000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedSubcategory, selectedBrands, inStockOnly, priceRange, sortBy, category.slug]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedSubcategory('all');
    setSelectedBrands([]);
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div>
      {/* 1. Category Hero Banner */}
      <section className={styles.categoryHero}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <ChevronRight size={14} />
            <span>{category.name}</span>
            {selectedSubcategory !== 'all' && (
              <>
                <ChevronRight size={14} />
                <span style={{ color: '#ffde59' }}>
                  {category.subcategories.find((s) => s.slug === selectedSubcategory)?.name || selectedSubcategory}
                </span>
              </>
            )}
          </div>

          <div className={styles.heroContent}>
            <div>
              <div className={styles.categoryTagline}>{category.tagline}</div>
              <h1 className={styles.categoryTitle}>{category.name}</h1>
              <p className={styles.categoryDesc}>{category.description}</p>
            </div>

            <div className={styles.heroImageWrap}>
              <Image
                src={category.heroImage}
                alt={category.name}
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Subcategory Quick Filter Pills */}
      <div className={styles.subcategoriesBar}>
        <div className="container">
          <div className={styles.subcategoriesList}>
            <button
              className={`${styles.subPill} ${selectedSubcategory === 'all' ? styles.subPillActive : ''}`}
              onClick={() => setSelectedSubcategory('all')}
            >
              All {category.name} ({products.length})
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.slug}
                className={`${styles.subPill} ${selectedSubcategory === sub.slug ? styles.subPillActive : ''}`}
                onClick={() => setSelectedSubcategory(sub.slug)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Catalog Main Layout */}
      <div className="container">
        <div className={styles.catalogLayout}>
          {/* Filters Sidebar */}
          <aside className={styles.sidebar}>
            {/* Category Navigation (Matches User Screenshot) */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className={styles.sidebarCategoryNav}>
                <ul className={styles.sidebarCategoryList}>
                  {category.subcategories.map((sub) => {
                    const isActive = selectedSubcategory === sub.slug;
                    return (
                      <li key={sub.slug}>
                        <button
                          type="button"
                          className={`${styles.sidebarCategoryBtn} ${isActive ? styles.sidebarCategoryBtnActive : ''}`}
                          onClick={() => setSelectedSubcategory(sub.slug)}
                        >
                          {sub.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className={styles.filterHeading}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Filter size={16} /> Filters
              </span>
              {(selectedBrands.length > 0 || priceRange !== 'all' || inStockOnly || selectedSubcategory !== 'all') && (
                <button
                  onClick={resetFilters}
                  style={{ fontSize: '0.75rem', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Brand</div>
              {availableBrands.map((brand) => (
                <label key={brand} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>

            {/* Price Filter */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Price</div>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'all'}
                  onChange={() => setPriceRange('all')}
                />
                <span>All Prices</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'under-1000'}
                  onChange={() => setPriceRange('under-1000')}
                />
                <span>Under $1,000</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === '1000-2000'}
                  onChange={() => setPriceRange('1000-2000')}
                />
                <span>$1,000 to $2,000</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === '2000-5000'}
                  onChange={() => setPriceRange('2000-5000')}
                />
                <span>$2,000 to $5,000</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'over-5000'}
                  onChange={() => setPriceRange('over-5000')}
                />
                <span>$5,000+ Luxury Suites</span>
              </label>
            </div>

            {/* Availability */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Availability</div>
              <label className={styles.filterOption}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock & Ready to Ship</span>
              </label>
            </div>
          </aside>

          {/* Main Grid & Sort Controls */}
          <div>
            <div className={styles.controlBar}>
              <div className={styles.resultsCount}>
                Showing <strong>{filteredProducts.length}</strong> products in {category.name}
              </div>

              <div className={styles.sortSelectWrap}>
                <SlidersHorizontal size={14} />
                <span>Sort by:</span>
                <CustomDropdown
                  size="sm"
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onChange={setSortBy}
                />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyResults}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  No matching appliances found
                </h3>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Try clearing your filters or changing your price range.
                </p>
                <button onClick={resetFilters} className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
