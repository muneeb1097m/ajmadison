'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  CheckCircle,
  FileText,
  Phone,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import styles from './ProductDetail.module.css';
import { Product, getRelatedProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [zipCode, setZipCode] = useState('10001');
  const [zipChecked, setZipChecked] = useState(true);

  const related = getRelatedProducts(product, 3);
  const monthlyEst = Math.round(product.price / 24);

  const handleZipCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.length >= 5) {
      setZipChecked(true);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <Link href={`/${product.category}`}>{product.category.replace('-', ' ').toUpperCase()}</Link>
          <ChevronRight size={13} />
          <Link href={`/${product.category}/${product.subCategorySlug}`}>{product.subCategory}</Link>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Layout Grid */}
        <div className={styles.productLayout}>
          {/* Left: Gallery */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImageWrap}>
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.mainImage}
              />
            </div>

            {product.gallery && product.gallery.length > 1 && (
              <div className={styles.thumbnailRow}>
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    className={`${styles.thumbnailBtn} ${selectedImage === img ? styles.thumbnailBtnActive : ''}`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className={styles.thumbImg}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Truck size={20} color="var(--primary-navy)" />
                <div style={{ fontSize: '0.8rem' }}>
                  <strong>Free Delivery</strong>
                  <p style={{ color: 'var(--text-muted)' }}>On orders over $999 nationwide</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <ShieldCheck size={20} color="var(--primary-navy)" />
                <div style={{ fontSize: '0.8rem' }}>
                  <strong>Factory Warranty</strong>
                  <p style={{ color: 'var(--text-muted)' }}>Authorized Dealer with genuine parts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info & Pricing */}
          <div className={styles.infoSection}>
            <div className={styles.brandRow}>
              <span className={styles.brandName}>{product.brand}</span>
              <span className={styles.modelNumber}>Model: {product.modelNumber}</span>
            </div>

            <h1 className={styles.productTitle}>{product.name}</h1>

            <div className={styles.reviewsRating}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                    stroke="#f59e0b"
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{product.rating.toFixed(1)}</span>
              <span>· {product.reviewsCount} Verified Customer Reviews</span>
            </div>

            {/* Pricing Box */}
            <div className={styles.pricingBox}>
              <div className={styles.priceRow}>
                <span className={styles.currentPrice}>
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className={styles.originalPrice}>
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="badge badge-gold">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              <div className={styles.financingNote}>
                Starting at <strong>${monthlyEst}/mo</strong> with 0% APR financing options.
              </div>

              {product.rebate && (
                <div className={styles.rebateCallout}>
                  <span>🎁</span> {product.rebate}
                </div>
              )}

              {/* Purchase Actions */}
              <div className={styles.purchaseActions}>
                <div className={styles.qtyPicker}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  className={styles.mainAddToCartBtn}
                  onClick={() => addToCart(product, quantity)}
                >
                  <ShoppingCart size={20} /> Add to Cart (${(product.price * quantity).toLocaleString()})
                </button>
              </div>

              {/* Live Zip Code Delivery Checker */}
              <div className={styles.zipEstimator}>
                <div className={styles.zipHeader}>
                  <MapPin size={16} /> Delivery & Availability Checker
                </div>
                <form onSubmit={handleZipCheck} className={styles.zipForm}>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter 5-digit ZIP"
                    className={styles.zipInput}
                    maxLength={5}
                  />
                  <button type="submit" className={styles.zipBtn}>
                    Update ZIP
                  </button>
                </form>
                {zipChecked && (
                  <div className={styles.zipResult}>
                    <CheckCircle size={14} />
                    <span>
                      In Stock for ZIP {zipCode}: Estimated Delivery in <strong>2-4 Business Days</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Included Items (For Kitchen Suites) */}
            {product.includedItems && product.includedItems.length > 0 && (
              <div className={styles.packageItemsCard}>
                <div className={styles.packageTitle}>
                  📦 What&apos;s Included in this Appliance Suite:
                </div>
                <ul className={styles.packageList}>
                  {product.includedItems.map((item, idx) => (
                    <li key={idx} className={styles.packageItem}>
                      <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Short Description */}
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Call Expert CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <Phone size={20} color="var(--primary-navy)" />
              <div style={{ fontSize: '0.86rem' }}>
                Questions about cabinet cutouts or custom panels?
                <br />
                <a href="tel:8005703355" style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>
                  Speak to an AJ Madison Specialist at 800-570-3355
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Features Section */}
        <section className={styles.specsSection}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '1rem' }}>
            Product Specifications & Dimensions
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, borderBottom: '2px solid var(--primary-navy)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                Key Technical Details
              </h3>
              <table className={styles.specsTable}>
                <tbody>
                  {product.specs.dimensions && (
                    <tr>
                      <td className={styles.specLabel}>Dimensions (W x H x D)</td>
                      <td className={styles.specValue}>{product.specs.dimensions}</td>
                    </tr>
                  )}
                  {product.specs.capacity && (
                    <tr>
                      <td className={styles.specLabel}>Capacity</td>
                      <td className={styles.specValue}>{product.specs.capacity}</td>
                    </tr>
                  )}
                  {product.specs.noiseLevel && (
                    <tr>
                      <td className={styles.specLabel}>Noise Level</td>
                      <td className={styles.specValue}>{product.specs.noiseLevel}</td>
                    </tr>
                  )}
                  {product.specs.finish && (
                    <tr>
                      <td className={styles.specLabel}>Exterior Finish</td>
                      <td className={styles.specValue}>{product.specs.finish}</td>
                    </tr>
                  )}
                  {product.specs.energyStar && (
                    <tr>
                      <td className={styles.specLabel}>Energy Rating</td>
                      <td className={styles.specValue}>{product.specs.energyStar}</td>
                    </tr>
                  )}
                  {product.specs.fuelType && (
                    <tr>
                      <td className={styles.specLabel}>Fuel / Voltage</td>
                      <td className={styles.specValue}>{product.specs.fuelType}</td>
                    </tr>
                  )}
                  {product.specs.warranty && (
                    <tr>
                      <td className={styles.specLabel}>Manufacturer Warranty</td>
                      <td className={styles.specValue}>{product.specs.warranty}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, borderBottom: '2px solid var(--primary-navy)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                Included Key Innovations
              </h3>
              {product.specs.features && (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  {product.specs.features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem' }}>
                      <CheckCircle size={18} color="var(--primary-navy)" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-light)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '1.5rem' }}>
              Customers Also Considered
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
