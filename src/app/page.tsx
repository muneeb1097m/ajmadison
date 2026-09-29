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
  Phone,
  Volume2,
  Award,
} from 'lucide-react';
import styles from './page.module.css';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, getProductsByCategory, CATEGORIES } from '@/data/products';

import HomeHeroSection from '@/components/HomeHeroSection';

export default function HomePage() {
  const closeoutProducts = PRODUCTS.filter((p) => p.isCloseout);
  const washersDryers = getProductsByCategory('washers-dryers').slice(0, 4);
  const dishwashers = getProductsByCategory('dishwashers').slice(0, 4);
  const kitchenPackages = getProductsByCategory('kitchen-packages').slice(0, 4);
  const luxuryAppliances = getProductsByCategory('luxury-appliances').slice(0, 4);
  const smallAppliances = getProductsByCategory('small-appliances').slice(0, 4);

  return (
    <div>
      {/* 1. DYNAMIC HERO BANNER (Managed from Admin Portal) */}
      <HomeHeroSection />

      {/* 2. SHOP BY CATEGORY (10 Circular Items Matching User Screenshot) */}
      <section className={styles.categorySection}>
        <div className="container">
          <h2 className={styles.categorySectionTitle}>Shop By Category</h2>

          <div className={styles.categoryGridCircles}>
            {[
              {
                name: 'Packages',
                href: '/kitchen-packages',
                image: '/images/categories/packages.png',
              },
              {
                name: 'Washers & Dryers',
                href: '/washers-dryers',
                image: '/images/categories/washers_dryers.png',
              },
              {
                name: 'Refrigerators',
                href: '/kitchen-packages',
                image: '/images/categories/refrigerators.png',
              },
              {
                name: 'Cooking',
                href: '/luxury-appliances',
                image: '/images/categories/cooking.png',
              },
              {
                name: 'Dishwashers',
                href: '/dishwashers',
                image: '/images/categories/dishwashers.png',
              },
              {
                name: 'Outdoor',
                href: '/luxury-appliances',
                image: '/images/categories/outdoor.png',
              },
              {
                name: 'Sinks & Faucets',
                href: '/kitchen-packages',
                image: '/images/categories/sinks_faucets.png',
              },
              {
                name: 'AC & Air Quality',
                href: '/small-appliances',
                image: '/images/categories/ac_air_quality.png',
              },
              {
                name: 'Smart Appliances',
                href: '/kitchen-packages',
                image: '/images/categories/smart_appliances.png',
              },
              {
                name: 'Closeouts',
                href: '/closeout-deals',
                image: '/images/categories/closeouts.png',
              },
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href} className={styles.categoryCircleItem}>
                <div className={styles.categoryCircleWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={styles.categoryCircleImg}
                  />
                </div>
                <span className={styles.categoryCircleLabel}>{cat.name}</span>
              </Link>
            ))}
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

      {/* BANNER 1: MANUFACTURER REBATES & BUNDLE CASHBACK */}
      <div className="container">
        <div className={styles.bannerRebate}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Percent size={13} style={{ marginRight: '4px' }} /> Mail-In Factory Rebates
            </span>
            <h2 className={styles.promoTitle}>Save Up To $2,000 On Complete Kitchen Packages</h2>
            <p className={styles.promoText}>
              Combine qualifying luxury refrigerators, professional ranges, wall ovens, and dishwashers from Bosch, Thermador, Samsung, and LG for maximum factory cash-back savings.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/kitchen-packages" className="btn-red">
                Explore Bundle Rebates <ArrowRight size={16} />
              </Link>
              <a href="tel:8005703355" className="btn-outline-white">
                <Phone size={15} /> Call For Package Quote
              </a>
            </div>
          </div>
          <div className={styles.promoImageWrap}>
            <Image
              src="/images/hero_center_kitchen.png"
              alt="Kitchen Package Rebates"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

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
              src="/images/hero_middle_frame.png"
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

      {/* BANNER 3: NATIONWIDE WHITE-GLOVE IN-HOME DELIVERY */}
      <div className="container">
        <div className={styles.bannerDelivery}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Truck size={13} style={{ marginRight: '4px' }} /> In-Home Delivery & Connection
            </span>
            <h2 className={styles.promoTitle}>Nationwide White-Glove In-Home Delivery & Haul-Away</h2>
            <p className={styles.promoText}>
              Our certified appliance delivery specialists bring your laundry machines and kitchen suites directly into your room of choice, unbox, level, test connection lines, and haul away old units.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/washers-dryers" className="btn-red">
                Reserve Delivery Schedule <ArrowRight size={16} />
              </Link>
              <a href="tel:8005703355" className="btn-outline-white">
                <ShieldCheck size={15} /> Delivery Guarantee
              </a>
            </div>
          </div>
          <div className={styles.promoImageWrap}>
            <Image
              src="/images/products/lg-washtower-wkgx201hwa.jpg"
              alt="White-Glove Delivery Specialist"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

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

      {/* BANNER 4: WHISPER-QUIET 38-42 dBA GUARANTEE */}
      <div className="container">
        <div className={styles.bannerQuiet}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Volume2 size={13} style={{ marginRight: '4px' }} /> Library-Quiet Certified
            </span>
            <h2 className={styles.promoTitle}>Undisturbed Home Living: Ultra-Quiet 38–42 dBA Dishwashers</h2>
            <p className={styles.promoText}>
              Engineered with multi-stage sound absorption, EcoSilence drive motors, and patented CrystalDry technology. Run full sanitizing cycles without hearing a whisper in open living spaces.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/dishwashers" className="btn-red">
                Shop Quiet Dishwashers <ArrowRight size={16} />
              </Link>
              <Link href="/dishwashers/panel-ready" className="btn-outline-white">
                Explore Panel-Ready Suites
              </Link>
            </div>
          </div>
          <div className={styles.promoImageWrap}>
            <Image
              src="/images/products/bosch-shp78cm5n-1.jpg"
              alt="Ultra Quiet Kitchen Dishwasher"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

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

      {/* BANNER 5: TRADE & ARCHITECTURAL CONSULTATION */}
      <div className="container">
        <div className={styles.bannerTrade}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Award size={13} style={{ marginRight: '4px' }} /> Trade & Architectural Division
            </span>
            <h2 className={styles.promoTitle}>Designing a Luxury Estate? Partner with AJ Madison Pro</h2>
            <p className={styles.promoText}>
              Architects, interior designers, and general contractors receive trade pricing, dedicated spec coordination, technical cutout blueprints, and nationwide priority delivery.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="tel:8005703355" className="btn-red">
                <Phone size={15} /> Call Trade Concierge: 800-570-3355
              </a>
              <Link href="/luxury-appliances" className="btn-outline-white">
                View Luxury Suites <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className={styles.promoImageWrap}>
            <Image
              src="/images/hero_center_kitchen.png"
              alt="Luxury Kitchen Design Architecture"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

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
