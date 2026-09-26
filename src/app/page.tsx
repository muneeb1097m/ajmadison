import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Percent,
  CheckCircle,
} from 'lucide-react';
import styles from './page.module.css';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, getProductsByCategory, CATEGORIES } from '@/data/products';

export default function HomePage() {
  const closeoutProducts = PRODUCTS.filter((p) => p.isCloseout);
  const washersDryers = getProductsByCategory('washers-dryers').slice(0, 4);
  const dishwashers = getProductsByCategory('dishwashers').slice(0, 4);
  const kitchenPackages = getProductsByCategory('kitchen-packages').slice(0, 4);
  const luxuryAppliances = getProductsByCategory('luxury-appliances').slice(0, 4);
  const smallAppliances = getProductsByCategory('small-appliances').slice(0, 4);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroTagline}>
                <Sparkles size={14} /> Official Appliance Headquarters
              </div>
              <h1 className={styles.heroHeading}>
                Save Up To <span>50% Off</span> On Top Appliance Packages
              </h1>
              <p className={styles.heroDescription}>
                Shop America&apos;s largest selection of luxury kitchen suites, whisper-quiet dishwashers, high-efficiency laundry pairs, and exclusive closeouts.
              </p>
              <div className={styles.heroButtons}>
                <Link href="/closeout-deals" className="btn-red">
                  <Tag size={18} /> Shop Closeout Deals
                </Link>
                <Link href="/kitchen-packages" className="btn-outline-white">
                  Explore Kitchen Packages <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className={styles.heroCardWrap}>
              <div className={styles.heroCard}>
                <span className={styles.heroCardBadge}>Save $1,398</span>
                <div className={styles.heroCardImage}>
                  <Image
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                    alt="Samsung 4-Piece Kitchen Suite"
                    fill
                    priority
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.heroCardContent}>
                  <h3>Samsung 4-Piece Stainless Suite</h3>
                  <p>French Door Fridge + Gas Range + 48 dBA Dishwasher + OTR Microwave</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>$2,498</span>
                    <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>$3,896</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ONLY 6 APPROVED CATEGORY TILES (Matches User Specification) */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Shop By Department</h2>
              <p className={styles.sectionSubtitle}>Select from our curated appliance collections</p>
            </div>
          </div>

          <div className={styles.categoryGrid}>
            {/* Closeout Deals */}
            <Link href="/closeout-deals" className={`${styles.categoryTile} ${styles.categoryTileSpecial}`}>
              <div className={styles.tileImageWrap}>
                <Image
                  src={CATEGORIES['closeout-deals'].heroImage}
                  alt="Closeout Deals"
                  fill
                  className={styles.tileImage}
                />
              </div>
              <h3 className={styles.tileName} style={{ color: 'var(--accent-red)' }}>Closeout Deals</h3>
              <span className={styles.tileSubtext}>Up to 50% Off</span>
            </Link>

            {/* Washers & Dryers */}
            <Link href="/washers-dryers" className={styles.categoryTile}>
              <div className={styles.tileImageWrap}>
                <Image
                  src={CATEGORIES['washers-dryers'].heroImage}
                  alt="Washers & Dryers"
                  fill
                  className={styles.tileImage}
                />
              </div>
              <h3 className={styles.tileName}>Washers & Dryers</h3>
              <span className={styles.tileSubtext}>Front & Top Load</span>
            </Link>

            {/* Dishwashers */}
            <Link href="/dishwashers" className={styles.categoryTile}>
              <div className={styles.tileImageWrap}>
                <Image
                  src={CATEGORIES['dishwashers'].heroImage}
                  alt="Dishwashers"
                  fill
                  className={styles.tileImage}
                />
              </div>
              <h3 className={styles.tileName}>Dishwashers</h3>
              <span className={styles.tileSubtext}>39-44 dBA Quiet</span>
            </Link>

            {/* Kitchen Packages */}
            <Link href="/kitchen-packages" className={styles.categoryTile}>
              <div className={styles.tileImageWrap}>
                <Image
                  src={CATEGORIES['kitchen-packages'].heroImage}
                  alt="Kitchen Packages"
                  fill
                  className={styles.tileImage}
                />
              </div>
              <h3 className={styles.tileName}>Kitchen Packages</h3>
              <span className={styles.tileSubtext}>Save up to $1,500</span>
            </Link>

            {/* Luxury Appliances */}
            <Link href="/luxury-appliances" className={styles.categoryTile}>
              <div className={styles.tileImageWrap}>
                <Image
                  src={CATEGORIES['luxury-appliances'].heroImage}
                  alt="Luxury Appliances"
                  fill
                  className={styles.tileImage}
                />
              </div>
              <h3 className={styles.tileName}>Luxury Appliances</h3>
              <span className={styles.tileSubtext}>Sub-Zero & Wolf</span>
            </Link>

            {/* Small Appliances */}
            <Link href="/small-appliances" className={styles.categoryTile}>
              <div className={styles.tileImageWrap}>
                <Image
                  src={CATEGORIES['small-appliances'].heroImage}
                  alt="Small Appliances"
                  fill
                  className={styles.tileImage}
                />
              </div>
              <h3 className={styles.tileName}>Small Appliances</h3>
              <span className={styles.tileSubtext}>Countertop & Coffee</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CLOSEOUT DEALS SPOTLIGHT */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="badge badge-red" style={{ marginBottom: '0.4rem' }}>
                <Percent size={13} style={{ marginRight: '4px' }} /> Limited Warehouse Inventory
              </span>
              <h2 className={styles.sectionTitle}>Featured Closeout Deals</h2>
              <p className={styles.sectionSubtitle}>
                Massive instant savings on washers, dishwashers, and packages while supplies last.
              </p>
            </div>
            <Link href="/closeout-deals" className={styles.viewAllLink}>
              View All Closeout Deals <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {closeoutProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. KITCHEN PACKAGES SUITES */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
                Coordinated Remodel Suites
              </span>
              <h2 className={styles.sectionTitle}>Kitchen Packages & Bundle Savings</h2>
              <p className={styles.sectionSubtitle}>
                Matched appliances designed to seamlessly harmonize with your cabinetry.
              </p>
            </div>
            <Link href="/kitchen-packages" className={styles.viewAllLink}>
              View All Kitchen Packages <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {kitchenPackages.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROMO CALLOUT BANNER */}
      <div className="container">
        <div className={styles.promoBanner}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              AJ Madison Guarantee
            </span>
            <h2 className={styles.promoTitle}>Need Help Sizing Your Appliances?</h2>
            <p className={styles.promoText}>
              Our certified appliance specialists ensure your cutouts, water lines, and electrical requirements align perfectly before delivery. Contact our dedicated sales team today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="tel:8005703355" className="btn-red">
                Call 800-570-3355
              </a>
              <Link href="/luxury-appliances" className="btn-outline-white">
                Book Showroom Consultation
              </Link>
            </div>
          </div>
          <div className={styles.promoImageWrap}>
            <Image
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80"
              alt="Kitchen Consultation"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* 6. WASHERS & DRYERS SECTION */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Washers & Dryers</h2>
              <p className={styles.sectionSubtitle}>
                Front load washers, steam sanitized dryers, and stacked laundry systems.
              </p>
            </div>
            <Link href="/washers-dryers" className={styles.viewAllLink}>
              View All Washers & Dryers <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {washersDryers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. DISHWASHERS SECTION */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Whisper-Quiet Dishwashers</h2>
              <p className={styles.sectionSubtitle}>
                Patented CrystalDry, AutoDos, and stainless interiors rated 39-44 dBA.
              </p>
            </div>
            <Link href="/dishwashers" className={styles.viewAllLink}>
              View All Dishwashers <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {dishwashers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. LUXURY APPLIANCES */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
                <Sparkles size={13} style={{ marginRight: '4px' }} /> Masterpiece Collection
              </span>
              <h2 className={styles.sectionTitle}>Luxury Culinary & Refrigeration</h2>
              <p className={styles.sectionSubtitle}>
                Featuring Sub-Zero preservation, Wolf pro ranges, and Miele German craftsmanship.
              </p>
            </div>
            <Link href="/luxury-appliances" className={styles.viewAllLink}>
              Explore Luxury Brands <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {luxuryAppliances.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. SMALL APPLIANCES */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Small Appliances & Coffee</h2>
              <p className={styles.sectionSubtitle}>
                Barista touch espresso machines, heritage stand mixers, and precision speed ovens.
              </p>
            </div>
            <Link href="/small-appliances" className={styles.viewAllLink}>
              View All Small Appliances <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {smallAppliances.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. BRANDS MARQUEE / STRIP */}
      <div className={styles.brandsStrip}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Authorized Dealer for America&apos;s Leading Appliance Brands
          </div>
          <div className={styles.brandsGrid}>
            <span className={styles.brandPill}>BOSCH</span>
            <span className={styles.brandPill}>SUB-ZERO</span>
            <span className={styles.brandPill}>WOLF</span>
            <span className={styles.brandPill}>MIELE</span>
            <span className={styles.brandPill}>THERMADOR</span>
            <span className={styles.brandPill}>LG</span>
            <span className={styles.brandPill}>SAMSUNG</span>
            <span className={styles.brandPill}>KITCHENAID</span>
            <span className={styles.brandPill}>BREVILLE</span>
            <span className={styles.brandPill}>SPEED QUEEN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
