'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, ArrowRight, Sparkles } from 'lucide-react';
import styles from '@/app/page.module.css';
import { HeroSettings, DEFAULT_HERO_SETTINGS } from '@/data/heroSettings';

export default function HomeHeroSection() {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ajm_hero_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch {
      // use default
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ajm_hero_settings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroTagline}>
              <Sparkles size={14} /> {settings.tagline}
            </div>
            <h1 className={styles.heroHeading}>
              {settings.headingPrefix} <span>{settings.headingHighlight}</span> {settings.headingSuffix}
            </h1>
            <p className={styles.heroDescription}>
              {settings.description}
            </p>
            <div className={styles.heroButtons}>
              <Link href={settings.primaryButtonLink} className="btn-red">
                <Tag size={18} /> {settings.primaryButtonText}
              </Link>
              <Link href={settings.secondaryButtonLink} className="btn-outline-white">
                {settings.secondaryButtonText} <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className={styles.heroCardWrap}>
            <div className={styles.heroCard}>
              {settings.cardBadge && (
                <span className={styles.heroCardBadge}>{settings.cardBadge}</span>
              )}
              <div className={styles.heroCardImage}>
                {/* Support both remote URLs and local data-urls */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.cardImage}
                  alt={settings.cardTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className={styles.heroCardContent}>
                <h3>{settings.cardTitle}</h3>
                <p>{settings.cardDescription}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                    ${Number(settings.cardPrice || 0).toLocaleString()}
                  </span>
                  {settings.cardOriginalPrice > settings.cardPrice && (
                    <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ${Number(settings.cardOriginalPrice).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
