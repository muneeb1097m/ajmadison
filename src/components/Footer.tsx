import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Headphones, CreditCard, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* 1. Value Props Strip (Minimal & Understated) */}
      <div className={styles.valuePropsStrip}>
        <div className="container">
          <div className={styles.valuePropsGrid}>
            <div className={styles.propItem}>
              <Truck size={20} strokeWidth={1.75} className={styles.propIcon} />
              <div>
                <div className={styles.propTitle}>Nationwide Delivery</div>
                <div className={styles.propDesc}>
                  Complimentary threshold delivery on qualifying suites.
                </div>
              </div>
            </div>

            <div className={styles.propItem}>
              <ShieldCheck size={20} strokeWidth={1.75} className={styles.propIcon} />
              <div>
                <div className={styles.propTitle}>Factory Authorized</div>
                <div className={styles.propDesc}>
                  Direct manufacturer warranties, rebates & verified parts.
                </div>
              </div>
            </div>

            <div className={styles.propItem}>
              <Headphones size={20} strokeWidth={1.75} className={styles.propIcon} />
              <div>
                <div className={styles.propTitle}>Appliance Specialists</div>
                <div className={styles.propDesc}>
                  Expert guidance on custom cabinetry cutouts & sizing.
                </div>
              </div>
            </div>

            <div className={styles.propItem}>
              <CreditCard size={20} strokeWidth={1.75} className={styles.propIcon} />
              <div>
                <div className={styles.propTitle}>Special Financing</div>
                <div className={styles.propDesc}>
                  Flexible payment plans with approved credit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content (Minimal 4 Columns) */}
      <div className={styles.mainFooter}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Column 1: Brand & Direct Concierge */}
            <div className={styles.brandCol}>
              <div className={styles.footerLogo}>
                ajmadison<span className={styles.footerLogoAccent}>.</span>
              </div>
              <div className={styles.brandTagline}>The Appliance Authority · Est. 2001</div>
              <p className={styles.brandBio}>
                Your premier destination for high-end kitchen packages, ultra-quiet dishwashers, and luxury architectural suites.
              </p>
              <div className={styles.minimalContact}>
                <span className={styles.contactLabel}>Need Expert Guidance?</span>
                <a href="tel:8005703355" className={styles.contactPhone}>
                  <Phone size={13} strokeWidth={2} /> 800-570-3355
                </a>
              </div>
            </div>

            {/* Column 2: Departments */}
            <div>
              <h4 className={styles.footerHeading}>Departments</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/closeout-deals" className={styles.closeoutLink}>
                    Closeout Deals
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

            {/* Column 3: Showrooms & Trade */}
            <div>
              <h4 className={styles.footerHeading}>Showrooms</h4>
              <ul className={styles.footerLinks}>
                <li className={styles.showroomItem}>
                  <span className={styles.showroomCity}>Brooklyn Flagship</span>
                  <span className={styles.showroomAddress}>3605 13th Ave</span>
                </li>
                <li className={styles.showroomItem}>
                  <span className={styles.showroomCity}>Washington D.C.</span>
                  <span className={styles.showroomAddress}>Tysons Corner, VA</span>
                </li>
                <li className={styles.showroomItem}>
                  <span className={styles.showroomCity}>Miami Design District</span>
                  <span className={styles.showroomAddress}>Florida Showroom</span>
                </li>
                <li style={{ marginTop: '0.4rem' }}>
                  <Link href="/join-pro" style={{ color: '#d4d4d8', fontWeight: 600 }}>
                    Trade & Contract Pro
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Client Care */}
            <div>
              <h4 className={styles.footerHeading}>Client Care</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/order-status">Track Reservation</Link>
                </li>
                <li>
                  <Link href="/kitchen-packages">Factory Rebates</Link>
                </li>
                <li>
                  <Link href="/luxury-appliances">Design Consultations</Link>
                </li>
                <li>
                  <Link href="/dishwashers">Library-Quiet Specs</Link>
                </li>
                <li>
                  <a href="tel:8005703355">Delivery & White-Glove FAQs</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Minimal Copyright Bar */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomInner}>
            <div>
              © {new Date().getFullYear()} AJ Madison Inc. All Rights Reserved.
            </div>
            <div className={styles.bottomLinks}>
              <Link href="/order-status">Reservation Status</Link>
              <span>·</span>
              <Link href="/join-pro">Trade Division</Link>
              <span>·</span>
              <Link href="/closeout-deals">Clearance</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
