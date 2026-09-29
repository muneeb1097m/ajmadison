'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Phone,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, CATEGORIES, Product } from '@/data/products';

export default function Header() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileDept, setExpandedMobileDept] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mobile drawer search state
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [drawerSearchResults, setDrawerSearchResults] = useState<Product[]>([]);
  const [drawerSearchOpen, setDrawerSearchOpen] = useState(false);
  const drawerSearchRef = useRef<HTMLDivElement>(null);

  // Filter products for desktop search bar autocomplete
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const results = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.modelNumber.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchResults(results);
      setSearchOpen(true);
    } else {
      setSearchResults([]);
      setSearchOpen(false);
    }
  }, [searchQuery]);

  // Filter products for mobile drawer search autocomplete
  useEffect(() => {
    if (drawerSearchQuery.trim().length > 1) {
      const q = drawerSearchQuery.toLowerCase();
      const results = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.modelNumber.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q)
      ).slice(0, 5);
      setDrawerSearchResults(results);
      setDrawerSearchOpen(true);
    } else {
      setDrawerSearchResults([]);
      setDrawerSearchOpen(false);
    }
  }, [drawerSearchQuery]);

  // Click outside to close search dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (drawerSearchRef.current && !drawerSearchRef.current.contains(event.target as Node)) {
        setDrawerSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      const first = searchResults[0];
      if (first) {
        router.push(`/product/${first.id}`);
      } else {
        router.push(`/closeout-deals`);
      }
    }
  };

  const handleDrawerSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerSearchQuery.trim()) {
      setDrawerSearchOpen(false);
      setMobileMenuOpen(false);
      const first = drawerSearchResults[0];
      if (first) {
        router.push(`/product/${first.id}`);
      } else {
        router.push(`/closeout-deals`);
      }
    }
  };

  const toggleMobileDept = (slug: string) => {
    setExpandedMobileDept((prev) => (prev === slug ? null : slug));
  };

  return (
    <header className={styles.headerWrapper}>
      {/* 1. Top Announcement Bar */}
      <div className={styles.announcementBanner}>
        <span>🔥 PRESIDENT&apos;S DAY SAVINGS: UP TO 50% OFF CLOSEOUTS + FREE NATIONWIDE DELIVERY ON $999+</span>
        <Link href="/closeout-deals">Shop Deals →</Link>
      </div>

      {/* 2. Desktop Utility Bar */}
      <div className={styles.utilityBar}>
        <div className={styles.utilityInner}>
          <div className={styles.utilityLeft}>
            <span className={styles.utilityLink}>
              <Truck size={14} /> Nationwide White-Glove Delivery
            </span>
            <span className={styles.utilityLink}>
              <ShieldCheck size={14} /> Factory Authorized Dealer
            </span>
          </div>
          <div className={styles.utilityRight}>
            <a href="tel:8005703355" className={styles.utilityLink}>
              <Phone size={14} /> 800-570-3355 (Call for Quotes)
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Header Row (Logo, Search, Cart, Mobile Toggle) */}
      <div className={styles.mainNavRow}>
        <div className={styles.mainNavInner}>
          {/* Mobile Hamburger Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Menu size={26} />
          </button>

          {/* Brand Logo */}
          <Link href="/" className={styles.logoLink}>
            <div>
              <span className={styles.logoText}>
                ajmadison<span className={styles.logoAccent}>.</span>
              </span>
              <span className={styles.logoSubtitle}>The Appliance Authority</span>
            </div>
          </Link>

          {/* Live Search Bar (Desktop) */}
          <div className={styles.searchContainer} ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search brands, model #s (e.g. Bosch 800, LG WashTower)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setSearchOpen(true)}
              />
              <button type="submit" className={styles.searchBtn} aria-label="Search">
                <Search size={18} />
              </button>
            </form>

            {/* Live Search Dropdown (Desktop) */}
            {searchOpen && searchResults.length > 0 && (
              <div className={styles.searchDropdown}>
                <div className={styles.searchSectionTitle}>Suggested Products & Models</div>
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className={styles.searchResultItem}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={44}
                      height={44}
                      className={styles.searchResultThumb}
                    />
                    <div className={styles.searchResultInfo}>
                      <div className={styles.searchResultName}>{product.name}</div>
                      <div className={styles.searchResultMeta}>
                        {product.brand} · Model: {product.modelNumber}
                      </div>
                    </div>
                    <div className={styles.searchResultPrice}>${product.price.toLocaleString()}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className={styles.headerActions}>
            {/* Mobile Call Option (Only item shown on mobile right header) */}
            <a
              href="tel:8005703355"
              className={styles.mobilePhoneBtn}
              aria-label="Call Appliance Experts at 800-570-3355"
            >
              <Phone size={17} />
              <span>Call</span>
            </a>

            {/* Desktop Appliance Experts Contact */}
            <a href="tel:8005703355" className={styles.actionItem}>
              <Phone size={22} color="var(--primary-navy)" />
              <div className={styles.actionText}>
                <span>Appliance Experts</span>
                <span className={styles.actionSub}>800-570-3355</span>
              </div>
            </a>

            {/* Desktop Cart Button */}
            <button
              className={styles.cartButton}
              onClick={openCart}
              aria-label="View Shopping Cart"
            >
              <ShoppingCart size={20} />
              <span className={styles.cartText}>Cart</span>
              {totalItems > 0 && (
                <span className={styles.cartCountBadge}>{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Desktop Navigation Bar (ONLY USER-REQUESTED PAGES) */}
      <nav className={styles.categoryBar} aria-label="Main Categories">
        <div className={styles.categoryInner}>
          <ul className={styles.categoryList}>
            {/* Closeout Deals */}
            <li className={`${styles.categoryItem} ${styles.categoryItemCloseout}`}>
              <Link
                href="/closeout-deals"
                className={`${styles.categoryLink} ${styles.closeoutLink}`}
              >
                <Tag size={16} /> Closeout Deals
              </Link>
              <div className={styles.megaMenu}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Warehouse Clearance by Category
                  </h4>
                  <div className={styles.megaSubgrid}>
                    {CATEGORIES['closeout-deals'].subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={sub.slug === 'all' ? '/closeout-deals' : `/${sub.slug}`}
                        className={styles.megaSubItem}
                      >
                        <span className={styles.megaSubName}>
                          {sub.name} <ArrowRight size={14} />
                        </span>
                        <span className={styles.megaSubCount}>{sub.count} items in stock</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={styles.megaFeaturedPromo}>
                  <div>
                    <span className="badge badge-red" style={{ marginBottom: '0.5rem' }}>Limited Quantities</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.5rem' }}>Save Up to 50% Off</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Factory closeouts, customer cancelations, and open box appliance suites with full warranty.
                    </p>
                  </div>
                  <Link href="/closeout-deals" className="btn-red" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    View All Clearance
                  </Link>
                </div>
              </div>
            </li>

            {/* Washers & Dryers */}
            <li className={styles.categoryItem}>
              <Link href="/washers-dryers" className={styles.categoryLink}>
                Washers & Dryers
              </Link>
              <div className={styles.megaMenu}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Shop Laundry Appliances
                  </h4>
                  <div className={styles.megaSubgrid}>
                    {CATEGORIES['washers-dryers'].subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/washers-dryers/${sub.slug}`}
                        className={styles.megaSubItem}
                      >
                        <span className={styles.megaSubName}>
                          {sub.name} <ArrowRight size={14} />
                        </span>
                        <span className={styles.megaSubCount}>{sub.count} models available</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={styles.megaFeaturedPromo}>
                  <div>
                    <span className="badge badge-navy" style={{ marginBottom: '0.5rem' }}>Laundry Innovation</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.5rem' }}>LG & Speed Queen Pairs</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      TurboWash 360, built-in AI sensors, and heavy-duty 25-year commercial motors.
                    </p>
                  </div>
                  <Link href="/washers-dryers" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Shop All Washers & Dryers
                  </Link>
                </div>
              </div>
            </li>

            {/* Dishwashers */}
            <li className={styles.categoryItem}>
              <Link href="/dishwashers" className={styles.categoryLink}>
                Dishwashers
              </Link>
              <div className={styles.megaMenu}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Shop Quiet Dishwashers
                  </h4>
                  <div className={styles.megaSubgrid}>
                    {CATEGORIES['dishwashers'].subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/dishwashers/${sub.slug}`}
                        className={styles.megaSubItem}
                      >
                        <span className={styles.megaSubName}>
                          {sub.name} <ArrowRight size={14} />
                        </span>
                        <span className={styles.megaSubCount}>{sub.count} models</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={styles.megaFeaturedPromo}>
                  <div>
                    <span className="badge badge-navy" style={{ marginBottom: '0.5rem' }}>Quiet Performance</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.5rem' }}>Bosch & Miele Precision</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      CrystalDry plastic drying and whisper-quiet 39-44 dBA operation.
                    </p>
                  </div>
                  <Link href="/dishwashers" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Shop All Dishwashers
                  </Link>
                </div>
              </div>
            </li>

            {/* Kitchen Packages */}
            <li className={styles.categoryItem}>
              <Link href="/kitchen-packages" className={styles.categoryLink}>
                Kitchen Packages
              </Link>
              <div className={styles.megaMenu}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Matching Kitchen Appliance Suites
                  </h4>
                  <div className={styles.megaSubgrid}>
                    {CATEGORIES['kitchen-packages'].subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/kitchen-packages/${sub.slug}`}
                        className={styles.megaSubItem}
                      >
                        <span className={styles.megaSubName}>
                          {sub.name} <ArrowRight size={14} />
                        </span>
                        <span className={styles.megaSubCount}>{sub.count} packages</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={styles.megaFeaturedPromo}>
                  <div>
                    <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Bundle & Save</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.5rem' }}>Save Up to $1,500+</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Coordinating 4-piece French door refrigerator, slide-in range, and quiet dishwasher packages.
                    </p>
                  </div>
                  <Link href="/kitchen-packages" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Explore Kitchen Suites
                  </Link>
                </div>
              </div>
            </li>

            {/* Luxury Appliances */}
            <li className={styles.categoryItem}>
              <Link href="/luxury-appliances" className={styles.categoryLink}>
                <Sparkles size={15} color="var(--accent-gold)" /> Luxury Appliances
              </Link>
              <div className={styles.megaMenu}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Sub-Zero, Wolf, Miele, Thermador & Monogram
                  </h4>
                  <div className={styles.megaSubgrid}>
                    {CATEGORIES['luxury-appliances'].subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/luxury-appliances/${sub.slug}`}
                        className={styles.megaSubItem}
                      >
                        <span className={styles.megaSubName}>
                          {sub.name} <ArrowRight size={14} />
                        </span>
                        <span className={styles.megaSubCount}>{sub.count} luxury lines</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={styles.megaFeaturedPromo}>
                  <div>
                    <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>White Glove Concierge</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.5rem' }}>Culinary Excellence</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Certified installation, dedicated luxury appliance advisors, and trade pricing.
                    </p>
                  </div>
                  <Link href="/luxury-appliances" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Explore Luxury Collection
                  </Link>
                </div>
              </div>
            </li>

            {/* Small Appliances */}
            <li className={styles.categoryItem}>
              <Link href="/small-appliances" className={styles.categoryLink}>
                Small Appliances
              </Link>
              <div className={styles.megaMenu}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Countertop Culinary Essentials
                  </h4>
                  <div className={styles.megaSubgrid}>
                    {CATEGORIES['small-appliances'].subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/small-appliances/${sub.slug}`}
                        className={styles.megaSubItem}
                      >
                        <span className={styles.megaSubName}>
                          {sub.name} <ArrowRight size={14} />
                        </span>
                        <span className={styles.megaSubCount}>{sub.count} models</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={styles.megaFeaturedPromo}>
                  <div>
                    <span className="badge badge-navy" style={{ marginBottom: '0.5rem' }}>Barista & Bakery</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.5rem' }}>Breville & KitchenAid</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Precision espresso machines, heavy-duty mixers, and high-performance Vitamix blenders.
                    </p>
                  </div>
                  <Link href="/small-appliances" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Shop Small Appliances
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* 5. Mobile Drawer - EXACT REPLICA OF THE SCREENSHOT PROVIDED BY THE USER */}
      {mobileMenuOpen && (
        <>
          <div
            className={styles.mobileDrawerOverlay}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={styles.mobileDrawer} role="dialog" aria-modal="true">
            {/* Top row with Brand Logo and Close X */}
            <div className={styles.mobileTopRow}>
              <div className={styles.mobileDrawerBrand}>
                <span className={styles.drawerLogoText}>
                  ajmadison<span style={{ color: '#d92525' }}>.</span>
                </span>
                <span className={styles.drawerLogoSub}>THE APPLIANCE AUTHORITY</span>
              </div>
              <button
                className={styles.mobileCloseBtn}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Sidebar Search Bar */}
            <div className={styles.drawerSearchContainer} ref={drawerSearchRef}>
              <form onSubmit={handleDrawerSearchSubmit} className={styles.drawerSearchForm}>
                <Search size={17} className={styles.drawerSearchIcon} />
                <input
                  type="text"
                  className={styles.drawerSearchInput}
                  placeholder="Search appliances, brands, models..."
                  value={drawerSearchQuery}
                  onChange={(e) => setDrawerSearchQuery(e.target.value)}
                  onFocus={() => drawerSearchQuery.trim().length > 1 && setDrawerSearchOpen(true)}
                />
                {drawerSearchQuery && (
                  <button
                    type="button"
                    className={styles.drawerSearchClearBtn}
                    onClick={() => {
                      setDrawerSearchQuery('');
                      setDrawerSearchOpen(false);
                    }}
                    aria-label="Clear Search Input"
                  >
                    <X size={15} />
                  </button>
                )}
              </form>

              {/* Drawer Search Results Autocomplete */}
              {drawerSearchOpen && drawerSearchResults.length > 0 && (
                <div className={styles.drawerSearchResults}>
                  <div className={styles.searchSectionTitle}>Suggested Products</div>
                  {drawerSearchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className={styles.searchResultItem}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setDrawerSearchOpen(false);
                        setDrawerSearchQuery('');
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className={styles.searchResultThumb}
                      />
                      <div className={styles.searchResultInfo}>
                        <div className={styles.searchResultName}>{product.name}</div>
                        <div className={styles.searchResultMeta}>
                          {product.brand} · Model: {product.modelNumber}
                        </div>
                      </div>
                      <div className={styles.searchResultPrice}>
                        ${product.price.toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Shopping Cart Option */}
            <div className={styles.drawerCartSection}>
              <button
                type="button"
                className={styles.drawerCartButton}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
              >
                <div className={styles.drawerCartLeft}>
                  <div className={styles.drawerCartIconWrap}>
                    <ShoppingCart size={19} />
                    {totalItems > 0 && (
                      <span className={styles.drawerCartBadge}>{totalItems}</span>
                    )}
                  </div>
                  <div className={styles.drawerCartText}>
                    <span className={styles.drawerCartTitle}>Shopping Cart</span>
                    <span className={styles.drawerCartSub}>
                      {totalItems > 0
                        ? `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`
                        : '0 items in cart'}
                    </span>
                  </div>
                </div>
                <div className={styles.drawerCartRight}>
                  <span className={styles.drawerCartActionLabel}>View Cart</span>
                  <ChevronRight size={17} color="#6b7280" />
                </div>
              </button>
            </div>

            {/* FEATURED SECTION (As highlighted in screenshot) */}
            <div className={styles.mobileSection}>
              <div className={styles.mobileSectionHeader}>FEATURED</div>
              <ul className={styles.mobileFeaturedList}>
                {/* Closeout Deals highlighted with green underline effect */}
                <li>
                  <Link
                    href="/closeout-deals"
                    className={`${styles.mobileFeaturedLink} ${styles.mobileCloseoutHighlight}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      borderBottom: '2px solid #22c55e',
                      backgroundColor: '#f0fdf4',
                    }}
                  >
                    <span>🔥 Closeout Deals</span>
                    <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>Save 50%</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/closeout-deals"
                    className={styles.mobileFeaturedLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Flash Sale: Save up to 50% Off</span>
                    <ChevronRight size={18} color="#9ca3af" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kitchen-packages"
                    className={styles.mobileFeaturedLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Kitchen Package Deals</span>
                    <ChevronRight size={18} color="#9ca3af" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* SHOP BY DEPARTMENT SECTION (ONLY the user requested departments) */}
            <div className={styles.mobileSection}>
              <div className={styles.mobileSectionHeader}>SHOP BY DEPARTMENT</div>
              <ul className={styles.mobileDeptList}>
                {/* Washers & Dryers */}
                <li className={styles.mobileDeptItem}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid #22c55e',
                    }}
                  >
                    <Link
                      href="/washers-dryers"
                      className={styles.mobileDeptButton}
                      style={{ flex: 1 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Washers & Dryers</span>
                    </Link>
                    <button
                      onClick={() => toggleMobileDept('washers-dryers')}
                      style={{ padding: '0.9rem', color: '#6b7280' }}
                      aria-label="Toggle Washers & Dryers subcategories"
                    >
                      {expandedMobileDept === 'washers-dryers' ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  </div>
                  {expandedMobileDept === 'washers-dryers' && (
                    <ul className={styles.mobileSubList}>
                      {CATEGORIES['washers-dryers'].subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/washers-dryers/${sub.slug}`}
                            className={styles.mobileSubLink}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{sub.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({sub.count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Dishwashers */}
                <li className={styles.mobileDeptItem}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid #22c55e',
                    }}
                  >
                    <Link
                      href="/dishwashers"
                      className={styles.mobileDeptButton}
                      style={{ flex: 1 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Dishwashers</span>
                    </Link>
                    <button
                      onClick={() => toggleMobileDept('dishwashers')}
                      style={{ padding: '0.9rem', color: '#6b7280' }}
                      aria-label="Toggle Dishwashers subcategories"
                    >
                      {expandedMobileDept === 'dishwashers' ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  </div>
                  {expandedMobileDept === 'dishwashers' && (
                    <ul className={styles.mobileSubList}>
                      {CATEGORIES['dishwashers'].subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/dishwashers/${sub.slug}`}
                            className={styles.mobileSubLink}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{sub.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({sub.count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Kitchen Packages */}
                <li className={styles.mobileDeptItem}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid #22c55e',
                    }}
                  >
                    <Link
                      href="/kitchen-packages"
                      className={styles.mobileDeptButton}
                      style={{ flex: 1 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Kitchen Packages</span>
                    </Link>
                    <button
                      onClick={() => toggleMobileDept('kitchen-packages')}
                      style={{ padding: '0.9rem', color: '#6b7280' }}
                      aria-label="Toggle Kitchen Packages subcategories"
                    >
                      {expandedMobileDept === 'kitchen-packages' ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  </div>
                  {expandedMobileDept === 'kitchen-packages' && (
                    <ul className={styles.mobileSubList}>
                      {CATEGORIES['kitchen-packages'].subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/kitchen-packages/${sub.slug}`}
                            className={styles.mobileSubLink}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{sub.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({sub.count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Luxury Appliances */}
                <li className={styles.mobileDeptItem}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid #22c55e',
                    }}
                  >
                    <Link
                      href="/luxury-appliances"
                      className={styles.mobileDeptButton}
                      style={{ flex: 1 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Luxury Appliances</span>
                    </Link>
                    <button
                      onClick={() => toggleMobileDept('luxury-appliances')}
                      style={{ padding: '0.9rem', color: '#6b7280' }}
                      aria-label="Toggle Luxury Appliances subcategories"
                    >
                      {expandedMobileDept === 'luxury-appliances' ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  </div>
                  {expandedMobileDept === 'luxury-appliances' && (
                    <ul className={styles.mobileSubList}>
                      {CATEGORIES['luxury-appliances'].subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/luxury-appliances/${sub.slug}`}
                            className={styles.mobileSubLink}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{sub.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({sub.count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Small Appliances */}
                <li className={styles.mobileDeptItem}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid #22c55e',
                    }}
                  >
                    <Link
                      href="/small-appliances"
                      className={styles.mobileDeptButton}
                      style={{ flex: 1 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Small Appliances</span>
                    </Link>
                    <button
                      onClick={() => toggleMobileDept('small-appliances')}
                      style={{ padding: '0.9rem', color: '#6b7280' }}
                      aria-label="Toggle Small Appliances subcategories"
                    >
                      {expandedMobileDept === 'small-appliances' ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  </div>
                  {expandedMobileDept === 'small-appliances' && (
                    <ul className={styles.mobileSubList}>
                      {CATEGORIES['small-appliances'].subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/small-appliances/${sub.slug}`}
                            className={styles.mobileSubLink}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{sub.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({sub.count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            {/* Mobile Drawer Call & Help info */}
            <div className={styles.mobileDrawerFooter}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Need Appliance Advice?
              </div>
              <a
                href="tel:8005703355"
                className="btn-primary"
                style={{ width: '100%', fontSize: '0.9rem', padding: '0.65rem' }}
              >
                <Phone size={16} /> Call 800-570-3355
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
