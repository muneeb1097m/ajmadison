import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Headphones, CreditCard, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* 1. Value Props Banner */}
      <div className={styles.valuePropsStrip}>
        <div className="container">
          <div className={styles.valuePropsGrid}>
            <div className={styles.propItem}>
              <Truck size={28} className={styles.propIcon} />
              <div>
                <div className={styles.propTitle}>Nationwide Delivery</div>
                <div className={styles.propDesc}>
                  Free curbside & threshold delivery on appliance orders over $999.
                </div>
              </div>
            </div>

            <div className={styles.propItem}>
              <ShieldCheck size={28} className={styles.propIcon} />
              <div>
                <div className={styles.propTitle}>Factory Authorized</div>
                <div className={styles.propDesc}>
                  100% genuine products with manufacturer warranties & rebates.
                </div>
              </div>
            </div>

            <div className={styles.propItem}>
              <Headphones size={28} className={styles.propIcon} />
              <div>
                <div className={styles.propTitle}>Appliance Specialists</div>
                <div className={styles.propDesc}>
                  Certified product consultants ready to assist with sizing & installation.
                </div>
              </div>
            </div>

            <div className={styles.propItem}>
              <CreditCard size={28} className={styles.propIcon} />
              <div>
                <div className={styles.propTitle}>Special Financing</div>
                <div className={styles.propDesc}>
                  0% APR financing available for up to 24 months with approved credit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className={styles.mainFooter}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Column 1: Brand Info & Call */}
            <div className={styles.brandCol}>
              <div className={styles.footerLogo}>
                ajmadison<span className={styles.footerLogoAccent}>.</span>
              </div>
              <div className={styles.brandTagline}>The Appliance Authority Since 2001</div>
              <p className={styles.brandBio}>
                Your premier destination for high-end kitchen packages, ultra-quiet dishwashers, commercial laundry systems, and luxury home appliances.
              </p>
              <div className={styles.phoneCard}>
                <Phone size={18} color="#ffde59" />
                <div>
                  <span style={{ fontSize: '0.75rem', display: 'block', color: '#9ca3af' }}>Need Expert Help?</span>
                  <a href="tel:8005703355">800-570-3355</a>
                </div>
              </div>
            </div>

            {/* Column 2: Exclusive Categories (Only the user-requested ones) */}
            <div>
              <h4 className={styles.footerHeading}>Shop Departments</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/closeout-deals" style={{ color: '#ef4444', fontWeight: 600 }}>
                    🔥 Closeout Deals
                  </Link>
                </li>
                <li>
                  <Link href="/washers-dryers">Washers & Dryers</Link>
                </li>
                <li>
                  <Link href="/dishwashers">Dishwashers</Link>
                </li>
                <li>
                  <Link href="/kitchen-packages">Kitchen Packages</Link>
                </li>
                <li>
                  <Link href="/luxury-appliances">Luxury Appliances</Link>
                </li>
                <li>
                  <Link href="/small-appliances">Small Appliances</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Showrooms & Services */}
            <div>
              <h4 className={styles.footerHeading}>Showrooms & Design</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#ffde59" /> Brooklyn Flagship (3605 13th Ave)
                  </span>
                </li>
                <li>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#ffde59" /> Washington D.C. Showroom
                  </span>
                </li>
                <li>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#ffde59" /> Tysons Corner, VA
                  </span>
                </li>
                <li>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#ffde59" /> Miami Design District, FL
                  </span>
                </li>
                <li>
                  <Link href="/join-pro">Trade & Contractor Program</Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Customer Care */}
            <div>
              <h4 className={styles.footerHeading}>Customer Care</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/order-status">Track Order Status</Link>
                </li>
                <li>
                  <Link href="/closeout-deals">Flash Rebates & Deals</Link>
                </li>
                <li>
                  <Link href="/washers-dryers">Laundry Sizing Guides</Link>
                </li>
                <li>
                  <Link href="/dishwashers">Dishwasher Decibel Chart</Link>
                </li>
                <li>
                  <Link href="/kitchen-packages">Kitchen Builder Suite</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomInner}>
            <div>
              © {new Date().getFullYear()} AJ Madison Inc. All Rights Reserved. Built with Next.js.
            </div>
            <div className={styles.paymentBadges}>
              <span className={styles.paymentPill}>Visa</span>
              <span className={styles.paymentPill}>Mastercard</span>
              <span className={styles.paymentPill}>Amex</span>
              <span className={styles.paymentPill}>Discover</span>
              <span className={styles.paymentPill}>Affirm 0% APR</span>
              <span className={styles.paymentPill}>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
