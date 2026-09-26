'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  Upload,
  CheckCircle,
  Tag,
  ArrowRight,
  Eye,
  Sliders,
  DollarSign,
  Type,
  Layout,
} from 'lucide-react';
import styles from '../admin.module.css';
import heroStyles from '@/app/page.module.css';
import { HeroSettings, DEFAULT_HERO_SETTINGS } from '@/data/heroSettings';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminHeroBannerPage() {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // Load from localStorage or Supabase on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ajm_hero_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettings((prev) => ({
          ...prev,
          cardImage: event.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = async () => {
    try {
      localStorage.setItem('ajm_hero_settings', JSON.stringify(settings));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'ajm_hero_settings',
          newValue: JSON.stringify(settings),
        })
      );
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'hero_banner',
          value: settings,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Supabase settings save note:', err);
      }
    }

    setIsSaved(true);
    setSaveMessage('Hero banner updated and published live to homepage!');
    setTimeout(() => {
      setIsSaved(false);
      setSaveMessage('');
    }, 4000);
  };

  const handleReset = () => {
    if (!confirm('Are you sure you want to reset the hero banner back to factory default?')) return;
    setSettings(DEFAULT_HERO_SETTINGS);
    try {
      localStorage.removeItem('ajm_hero_settings');
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'ajm_hero_settings',
          newValue: JSON.stringify(DEFAULT_HERO_SETTINGS),
        })
      );
    } catch {
      // ignore
    }
    setIsSaved(true);
    setSaveMessage('Reset back to factory defaults!');
    setTimeout(() => {
      setIsSaved(false);
      setSaveMessage('');
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Action Bar */}
      <div
        className={styles.tableCard}
        style={{
          marginBottom: '1.75rem',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#ffde59" /> Homepage Hero Banner Editor
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Customize the main announcement headline, promotional discount, CTA buttons, and featured appliance card.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn-outline"
            style={{ padding: '0.55rem 0.95rem', fontSize: '0.85rem' }}
          >
            <Eye size={15} /> {showPreview ? 'Hide Preview' : 'Show Live Preview'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn-outline"
            style={{ padding: '0.55rem 0.95rem', fontSize: '0.85rem', color: '#64748b' }}
            title="Reset to factory settings"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>

          <Link
            href="/"
            target="_blank"
            className="btn-outline"
            style={{ padding: '0.55rem 0.95rem', fontSize: '0.85rem' }}
            title="Open live homepage in a new tab"
          >
            <ExternalLink size={14} /> View Live Store
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Save size={15} /> Save & Publish
          </button>
        </div>
      </div>

      {/* Success notification banner */}
      {isSaved && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.85rem 1.25rem',
            background: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: '8px',
            color: '#15803d',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle size={18} /> {saveMessage}
        </div>
      )}

      {/* 1. REAL-TIME INTERACTIVE LIVE PREVIEW */}
      {showPreview && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              ⚡ Real-Time Live Preview (Exactly as seen on Storefront)
            </span>
          </div>

          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <section className={heroStyles.heroSection} style={{ padding: '3.5rem 0' }}>
              <div className="container">
                <div className={heroStyles.heroGrid}>
                  <div>
                    <div className={heroStyles.heroTagline}>
                      <Sparkles size={14} /> {settings.tagline}
                    </div>
                    <h1 className={heroStyles.heroHeading}>
                      {settings.headingPrefix} <span>{settings.headingHighlight}</span> {settings.headingSuffix}
                    </h1>
                    <p className={heroStyles.heroDescription}>
                      {settings.description}
                    </p>
                    <div className={heroStyles.heroButtons}>
                      <span className="btn-red" style={{ pointerEvents: 'none' }}>
                        <Tag size={18} /> {settings.primaryButtonText}
                      </span>
                      <span className="btn-outline-white" style={{ pointerEvents: 'none' }}>
                        {settings.secondaryButtonText} <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>

                  <div className={heroStyles.heroCardWrap}>
                    <div className={heroStyles.heroCard}>
                      {settings.cardBadge && (
                        <span className={heroStyles.heroCardBadge}>{settings.cardBadge}</span>
                      )}
                      <div className={heroStyles.heroCardImage} style={{ height: '220px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={settings.cardImage}
                          alt={settings.cardTitle}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className={heroStyles.heroCardContent}>
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
          </div>
        </div>
      )}

      {/* 2. FORM CONFIGURATION PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Panel 1: Headline & Tagline */}
        <div className={styles.tableCard} style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Type size={18} color="#2563eb" /> Main Headline & Description
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Top Badge Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Headline Prefix
              </label>
              <input
                type="text"
                value={settings.headingPrefix}
                onChange={(e) => setSettings({ ...settings, headingPrefix: e.target.value })}
                placeholder="e.g. Save Up To"
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.35rem' }}>
                Highlighted Text (Red Accent) *
              </label>
              <input
                type="text"
                value={settings.headingHighlight}
                onChange={(e) => setSettings({ ...settings, headingHighlight: e.target.value })}
                placeholder="e.g. 50% Off"
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1.5px solid #f87171', fontSize: '0.86rem', outline: 'none', background: '#fff5f5', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Headline Suffix
              </label>
              <input
                type="text"
                value={settings.headingSuffix}
                onChange={(e) => setSettings({ ...settings, headingSuffix: e.target.value })}
                placeholder="e.g. On Top Appliance Packages"
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Supporting Subtitle / Paragraph
              </label>
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Panel 2: CTA Action Buttons */}
        <div className={styles.tableCard} style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layout size={18} color="#2563eb" /> Call-To-Action (CTA) Buttons
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Primary Button */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.75rem' }}>
                🔴 Primary Button (Red Accent)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.primaryButtonText}
                    onChange={(e) => setSettings({ ...settings, primaryButtonText: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none', background: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={settings.primaryButtonLink}
                    onChange={(e) => setSettings({ ...settings, primaryButtonLink: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none', background: 'white' }}
                  />
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.75rem' }}>
                ⚪ Secondary Button (Frosted White Border)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.secondaryButtonText}
                    onChange={(e) => setSettings({ ...settings, secondaryButtonText: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none', background: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={settings.secondaryButtonLink}
                    onChange={(e) => setSettings({ ...settings, secondaryButtonLink: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none', background: 'white' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Featured Appliance Card */}
        <div className={styles.tableCard} style={{ gridColumn: '1 / -1', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} color="#2563eb" /> Featured Appliance Card (Right Side Showcase)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Card Titles & Prices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Top Corner Savings Badge
                </label>
                <input
                  type="text"
                  value={settings.cardBadge}
                  onChange={(e) => setSettings({ ...settings, cardBadge: e.target.value })}
                  placeholder="e.g. Save $1,398"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Showcase Title
                </label>
                <input
                  type="text"
                  value={settings.cardTitle}
                  onChange={(e) => setSettings({ ...settings, cardTitle: e.target.value })}
                  placeholder="e.g. Samsung 4-Piece Stainless Suite"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Subtitle / Package Components
                </label>
                <input
                  type="text"
                  value={settings.cardDescription}
                  onChange={(e) => setSettings({ ...settings, cardDescription: e.target.value })}
                  placeholder="e.g. French Door Fridge + Gas Range + 48 dBA Dishwasher"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    value={settings.cardPrice}
                    onChange={(e) => setSettings({ ...settings, cardPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Original Slashed Price ($)
                  </label>
                  <input
                    type="number"
                    value={settings.cardOriginalPrice}
                    onChange={(e) => setSettings({ ...settings, cardOriginalPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Card Image Setup */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                Featured Photo (URL or Upload)
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="url"
                  value={settings.cardImage}
                  onChange={(e) => setSettings({ ...settings, cardImage: e.target.value })}
                  placeholder="Paste image URL (https://... or svg)..."
                  style={{ flex: 1, padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
                />

                <input
                  type="file"
                  id="heroCardFileInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleCardImageUpload}
                />
                <label
                  htmlFor="heroCardFileInput"
                  className="btn-outline"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  title="Upload image from computer"
                >
                  <Upload size={14} />
                  <span>Upload</span>
                </label>
              </div>

              {/* Preview Thumbnail */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-medium)',
                  background: '#f1f5f9',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.cardImage}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
