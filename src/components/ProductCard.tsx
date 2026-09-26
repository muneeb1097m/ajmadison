'use client';

import React from 'react';
import Link from 'next/link';
import { Star, PlusCircle, Check } from 'lucide-react';
import styles from './ProductCard.module.css';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

function renderBrandBadge(brand: string) {
  const b = (brand || '').toLowerCase();
  if (b.includes('miele')) {
    return <span className={styles.mieleBadge}>Miele</span>;
  }
  if (b.includes('bosch')) {
    return (
      <span className={styles.boschBadge}>
        <span className={styles.boschIcon}>⊚</span> BOSCH
      </span>
    );
  }
  if (b.includes('samsung')) {
    return <span className={styles.samsungBadge}>SAMSUNG</span>;
  }
  if (b.includes('lg')) {
    return <span className={styles.lgBadge}><span className={styles.lgDot}>●</span>LG</span>;
  }
  if (b.includes('thermador')) {
    return <span className={styles.thermadorBadge}>Thermador</span>;
  }
  return <span className={styles.defaultBrandBadge}>{brand.toUpperCase()}</span>;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const ratingVal = Math.round(product.rating || 0);
  const reviewCount = product.reviewsCount || 0;

  return (
    <div className={styles.card}>
      {/* 1. Header: Left Badge + Right Brand Badge */}
      <div className={styles.cardHeader}>
        <div className={styles.badgeWrap}>
          {product.isCloseout ? (
            <span className="badge badge-red" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
              Clearance
            </span>
          ) : product.rebate ? (
            <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
              Rebate
            </span>
          ) : null}
        </div>

        <div className={styles.brandWrap}>
          {renderBrandBadge(product.brand)}
        </div>
      </div>

      {/* 2. Product Image Canvas (Clean & Centered on pure white) */}
      <Link href={`/product/${product.id}`} className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className={styles.productImage}
          loading="lazy"
        />
      </Link>

      {/* 3. Product Title (2-line clamp) */}
      <Link href={`/product/${product.id}`} className={styles.titleLink}>
        <h3 className={styles.title} title={product.name}>
          {product.name}
        </h3>
      </Link>

      {/* 4. Star Rating & Review Count */}
      <div className={styles.ratingRow}>
        {reviewCount > 0 ? (
          <>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((starNum) => (
                <Star
                  key={starNum}
                  size={12}
                  fill={starNum <= ratingVal ? '#d97706' : 'none'}
                  stroke={starNum <= ratingVal ? '#d97706' : '#d1d5db'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className={styles.reviewCount}>
              {reviewCount}
            </span>
          </>
        ) : (
          <div className={styles.emptyRatingSpace} />
        )}
      </div>

      {/* 5. Pricing Row */}
      <div className={styles.priceRow}>
        <span className={styles.currentPrice}>
          ${product.price.toLocaleString()}
        </span>
        {product.originalPrice > product.price && (
          <span className={styles.originalPrice}>
            ${product.originalPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* 6. Bottom Action: Minimal Plus Link Button */}
      <div className={styles.bottomAction}>
        <button
          className={styles.addToCartBtn}
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? (
            <>
              <Check size={16} color="#16a34a" /> Added to Cart
            </>
          ) : (
            <>
              <PlusCircle size={15} className={styles.plusIcon} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
