'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Check, Eye } from 'lucide-react';
import styles from './ProductCard.module.css';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const monthlyEst = Math.round(product.price / 24);

  return (
    <div className={styles.card}>
      {/* Badges */}
      <div className={styles.badgeRow}>
        {product.isCloseout ? (
          <span className="badge badge-red">{product.closeoutBadge || 'Closeout Deal'}</span>
        ) : product.badge ? (
          <span className="badge badge-navy">{product.badge}</span>
        ) : (
          <span />
        )}

        {product.originalPrice > product.price && (
          <span className="badge badge-gold">
            Save ${(product.originalPrice - product.price).toLocaleString()}
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link href={`/product/${product.id}`} className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.productImage}
        />
      </Link>

      {/* Brand & Model */}
      <div className={styles.metaRow}>
        <span className={styles.brand}>{product.brand}</span>
        <span className={styles.modelNumber}>#{product.modelNumber}</span>
      </div>

      {/* Title */}
      <Link href={`/product/${product.id}`}>
        <h3 className={styles.title} title={product.name}>
          {product.name}
        </h3>
      </Link>

      {/* Rating */}
      <div className={styles.ratingRow}>
        <div className={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
              stroke="#f59e0b"
            />
          ))}
        </div>
        <span>{product.rating.toFixed(1)}</span>
        <span>({product.reviewsCount})</span>
      </div>

      {/* Key Specs */}
      <ul className={styles.specsList}>
        {product.specs.capacity && (
          <li className={styles.specsItem}>
            <strong>Capacity:</strong> {product.specs.capacity}
          </li>
        )}
        {product.specs.noiseLevel && (
          <li className={styles.specsItem}>
            <strong>Noise Level:</strong> {product.specs.noiseLevel}
          </li>
        )}
        {product.specs.dimensions && (
          <li className={styles.specsItem}>
            <strong>Dimensions:</strong> {product.specs.dimensions}
          </li>
        )}
        {product.specs.features && product.specs.features[0] && (
          <li className={styles.specsItem}>
            <strong>Feature:</strong> {product.specs.features[0]}
          </li>
        )}
      </ul>

      {/* Pricing & Actions */}
      <div className={styles.pricingSection}>
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

        <div className={styles.financingNote}>
          Or ${monthlyEst}/mo with 0% APR financing
        </div>

        {product.rebate && (
          <div className={styles.rebateTag}>
            🏷️ {product.rebate}
          </div>
        )}

        <div className={styles.stockBadge}>
          <Check size={14} strokeWidth={3} />
          <span>In Stock & Ready for Free Delivery</span>
        </div>

        <div className={styles.actionButtons}>
          <button
            className={styles.addToCartBtn}
            onClick={() => addToCart(product, 1)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
          <Link href={`/product/${product.id}`} className={styles.viewDetailsBtn}>
            <Eye size={14} /> Full Specs & Details
          </Link>
        </div>
      </div>
    </div>
  );
}
