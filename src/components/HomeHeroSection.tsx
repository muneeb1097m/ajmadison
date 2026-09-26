'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './HomeHeroSection.module.css';
import { HeroSettings, DEFAULT_HERO_SETTINGS } from '@/data/heroSettings';

export default function HomeHeroSection() {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ajm_hero_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_HERO_SETTINGS, ...parsed });
      }
    } catch {
      // use default
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ajm_hero_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings({ ...DEFAULT_HERO_SETTINGS, ...parsed });
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const tiers = settings.tiers && settings.tiers.length > 0
    ? settings.tiers
    : DEFAULT_HERO_SETTINGS.tiers;

  return (
    <section className={styles.heroWrapper}>
      <div className="container">
        {/* 1. TOP FLASH SALE STRIP */}
        {settings.flashSaleActive !== false && (
          <div className={styles.flashBar}>
            <div className={styles.flashLeft}>
              <span className={styles.flashBadge}>
                {settings.flashSaleBadge || 'FLASH SALE'}
              </span>
              <div className={styles.flashImageWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.flashSaleImage || '/images/hero_flash_appliances.png'}
                  alt="Flash Sale Appliances"
                  className={styles.flashImage}
                />
              </div>
            </div>

            <div className={styles.flashCenter}>
              {settings.flashSaleText ? (
                <span>{settings.flashSaleText}</span>
              ) : (
                <>
                  EXCLUSIVE <strong>LIMITED-TIME DEALS</strong> ONLY AT AJM
                </>
              )}
            </div>

            <div className={styles.flashRight}>
              <Link
                href={settings.flashSaleButtonLink || '/closeout-deals'}
                className={styles.flashButton}
              >
                {settings.flashSaleButtonText || 'SHOP NOW'}
              </Link>
            </div>
          </div>
        )}

        {/* 2. MAIN HERO BANNER (3-COLUMN EXACT RECREATION) */}
        <div className={styles.mainBanner}>
          {/* COLUMN 1: NEW SEASON / FRESH SAVINGS / UP TO 50% OFF */}
          <div className={styles.leftCol}>
            <h1 className={styles.heading1}>
              {settings.headingLine1 || 'New Season.'}
            </h1>
            <h2 className={styles.heading2}>
              {settings.headingLine2 || 'Fresh Savings.'}
            </h2>

            <div className={styles.discountBox}>
              <div className={styles.upToLabel}>
                {settings.discountPrefix || 'UP TO'}
              </div>
              <div className={styles.discountVal}>
                {settings.discountValue || '50% OFF'}
              </div>
            </div>

            <Link
              href={settings.ctaLink || '/closeout-deals'}
              className={styles.ctaLink}
            >
              {settings.ctaText || 'SHOP ALL DEALS NOW →'}
            </Link>
          </div>

          {/* COLUMN 2: CENTER ARCH KITCHEN PHOTO WITH LIME FRAME */}
          <div className={styles.centerCol}>
            <Link href={settings.centerLink || '/kitchen-packages'} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.centerFrame}>
                <div className={styles.centerImageWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.centerImage || '/images/hero_center_kitchen.png'}
                    alt="Designer Picks Best-Sellers"
                    className={styles.centerImage}
                  />
                </div>
                <div className={styles.centerTag}>
                  {settings.centerImageTag || "DESIGNER PICKS, BEST-SELLERS & WHAT'S NEW"}
                </div>
              </div>
            </Link>
          </div>

          {/* COLUMN 3: THE MORE YOU BUY, THE MORE YOU SAVE TIER CARD */}
          <div className={styles.rightCol}>
            <div className={styles.tierCard}>
              <div className={styles.tierHeader}>
                <div>{settings.tierHeaderLine1 || 'THE MORE YOU BUY,'}</div>
                <div>{settings.tierHeaderLine2 || 'THE MORE YOU SAVE™'}</div>
              </div>
              <div className={styles.tierBody}>
                {tiers.map((t, idx) => (
                  <div key={idx} className={styles.tierRow}>
                    <span className={styles.tierDiscount}>{t.discount}</span>
                    <span className={styles.tierCondition}>{t.condition}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.tierFootnote}>
              {settings.tierFootnote || '*ON QUALIFYING ITEMS'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
