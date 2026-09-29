'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Filter, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Active filters count for badges
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange !== 'all') count += 1;
    if (inStockOnly) count += 1;
    return count;
  }, [selectedBrands, priceRange, inStockOnly]);

  // Lock body scroll and listen for Escape key when mobile filter popup is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMobileFilterOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileFilterOpen]);

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


      {/* 3. Catalog Main Layout */}
      <div className="container">
        {/* Mobile Horizontal Subcategory Scroll Bar (Ultra-Compact) */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className={styles.mobileSubcategoryBar}>
            <div className={styles.mobileSubcategoryScroll}>
              <button
                type="button"
                className={`${styles.mobileSubcategoryChip} ${selectedSubcategory === 'all' ? styles.mobileSubcategoryChipActive : ''}`}
                onClick={() => setSelectedSubcategory('all')}
              >
                <span>All</span>
                <span className={styles.chipCount}>
                  {products.filter((p) => p.category === category.slug).length}
                </span>
              </button>
              {category.subcategories.map((sub) => {
                const isActive = selectedSubcategory === sub.slug;
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    className={`${styles.mobileSubcategoryChip} ${isActive ? styles.mobileSubcategoryChipActive : ''}`}
                    onClick={() => setSelectedSubcategory(sub.slug)}
                  >
                    <span>{sub.name}</span>
                    {sub.count !== undefined && (
                      <span className={styles.chipCount}>{sub.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.catalogLayout}>
          {/* Filters Sidebar */}
          <aside className={styles.sidebar}>
            {/* Category Navigation (Matches User Screenshot) */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className={styles.sidebarCategoryNav}>
                <div className={styles.sidebarSectionTitle}>Categories</div>
                <ul className={styles.sidebarCategoryList}>
                  <li>
                    <button
                      type="button"
                      className={`${styles.sidebarCategoryBtn} ${selectedSubcategory === 'all' ? styles.sidebarCategoryBtnActive : ''}`}
                      onClick={() => setSelectedSubcategory('all')}
                    >
                      <span>All {category.name}</span>
                      <span className={styles.sidebarCategoryCount}>
                        {products.filter((p) => p.category === category.slug).length}
                      </span>
                    </button>
                  </li>
                  {category.subcategories.map((sub) => {
                    const isActive = selectedSubcategory === sub.slug;
                    return (
                      <li key={sub.slug}>
                        <button
                          type="button"
                          className={`${styles.sidebarCategoryBtn} ${isActive ? styles.sidebarCategoryBtnActive : ''}`}
                          onClick={() => setSelectedSubcategory(sub.slug)}
                        >
                          <span>{sub.name}</span>
                          {sub.count !== undefined && (
                            <span className={styles.sidebarCategoryCount}>{sub.count}</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Desktop Filters (Hidden on Mobile) */}
            <div className={styles.desktopFilters}>
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
            </div>
          </aside>

          {/* Main Grid & Sort Controls */}
          <div>
            <div className={styles.controlBar}>
              <div className={styles.controlBarLeft}>
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  className={styles.mobileControlFilterBtn}
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <Filter size={15} />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className={styles.filterBadge}>{activeFiltersCount}</span>
                  )}
                </button>

                <div className={styles.resultsCount}>
                  Showing <strong>{filteredProducts.length}</strong> products in {category.name}
                </div>
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

      {/* Mobile Filters Pop-up Modal / Sheet */}
      {isMobileFilterOpen && (
        <div
          className={styles.mobileModalOverlay}
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className={styles.mobileModalContainer}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filters-title"
          >
            {/* Header */}
            <div className={styles.mobileModalHeader}>
              <div className={styles.mobileModalTitleWrap}>
                <div className={styles.mobileFilterIconCircle}>
                  <Filter size={18} />
                </div>
                <div>
                  <h3 id="mobile-filters-title" className={styles.mobileModalTitle}>
                    Filters
                  </h3>
                  <span className={styles.mobileModalSubtitle}>
                    {filteredProducts.length} appliances found
                  </span>
                </div>
                {activeFiltersCount > 0 && (
                  <span className={styles.mobileFilterActiveBadge}>
                    {activeFiltersCount} active
                  </span>
                )}
              </div>
              <button
                type="button"
                className={styles.mobileModalCloseBtn}
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filters Body */}
            <div className={styles.mobileModalBody}>
              {/* Subcategories (Compact Grid) */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className={styles.mobileFilterSection}>
                  <div className={styles.mobileFilterSectionTitle}>Category</div>
                  <div className={styles.mobileSubcategoryGrid}>
                    <button
                      type="button"
                      className={`${styles.mobileSubcategoryOption} ${selectedSubcategory === 'all' ? styles.mobileSubcategoryOptionActive : ''}`}
                      onClick={() => setSelectedSubcategory('all')}
                    >
                      <span>All {category.name}</span>
                      <span className={styles.mobileOptionCount}>
                        {products.filter((p) => p.category === category.slug).length}
                      </span>
                    </button>
                    {category.subcategories.map((sub) => {
                      const isActive = selectedSubcategory === sub.slug;
                      return (
                        <button
                          key={sub.slug}
                          type="button"
                          className={`${styles.mobileSubcategoryOption} ${isActive ? styles.mobileSubcategoryOptionActive : ''}`}
                          onClick={() => setSelectedSubcategory(sub.slug)}
                        >
                          <span>{sub.name}</span>
                          {sub.count !== undefined && (
                            <span className={styles.mobileOptionCount}>{sub.count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div className={styles.mobileFilterSection}>
                  <div className={styles.mobileFilterSectionTitle}>Brand</div>
                  <div className={styles.mobileBrandsGrid}>
                    {availableBrands.map((brand) => {
                      const isChecked = selectedBrands.includes(brand);
                      return (
                        <label
                          key={brand}
                          className={`${styles.mobileBrandCard} ${isChecked ? styles.mobileBrandCardChecked : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(brand)}
                            className={styles.filterCheckbox}
                          />
                          <span>{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className={styles.mobileFilterSection}>
                <div className={styles.mobileFilterSectionTitle}>Price Range</div>
                <div className={styles.mobilePriceList}>
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-1000', label: 'Under $1,000' },
                    { id: '1000-2000', label: '$1,000 to $2,000' },
                    { id: '2000-5000', label: '$2,000 to $5,000' },
                    { id: 'over-5000', label: '$5,000+ Luxury Suites' },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`${styles.mobileRadioOption} ${priceRange === option.id ? styles.mobileRadioOptionActive : ''}`}
                    >
                      <input
                        type="radio"
                        name="mobile-price"
                        checked={priceRange === option.id}
                        onChange={() => setPriceRange(option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className={styles.mobileFilterSection}>
                <div className={styles.mobileFilterSectionTitle}>Availability</div>
                <label className={`${styles.mobileAvailabilityOption} ${inStockOnly ? styles.mobileAvailabilityOptionActive : ''}`}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className={styles.filterCheckbox}
                  />
                  <span>In Stock & Ready to Ship</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.mobileModalFooter}>
              <button
                type="button"
                className={styles.mobileModalResetBtn}
                onClick={resetFilters}
                disabled={activeFiltersCount === 0}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
              <button
                type="button"
                className={styles.mobileModalApplyBtn}
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Show {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
