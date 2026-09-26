'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  Upload,
  CheckCircle,
  Eye,
  Type,
  Layout,
  Layers,
  Zap,
  Plus,
  Trash2,
} from 'lucide-react';
import styles from '../admin.module.css';
import heroStyles from '@/components/HomeHeroSection.module.css';
import { HeroSettings, DEFAULT_HERO_SETTINGS, SavingsTier } from '@/data/heroSettings';
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
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_HERO_SETTINGS, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCenterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettings((prev) => ({
          ...prev,
          centerImage: event.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFlashImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettings((prev) => ({
          ...prev,
          flashSaleImage: event.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTierChange = (index: number, field: keyof SavingsTier, value: string) => {
    const newTiers = [...(settings.tiers || DEFAULT_HERO_SETTINGS.tiers)];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setSettings({ ...settings, tiers: newTiers });
  };

  const handleAddTier = () => {
    const newTiers = [...(settings.tiers || DEFAULT_HERO_SETTINGS.tiers)];
    newTiers.push({ discount: '$100 OFF', condition: 'WHEN YOU BUY 1' });
    setSettings({ ...settings, tiers: newTiers });
  };

  const handleRemoveTier = (index: number) => {
    const newTiers = [...(settings.tiers || DEFAULT_HERO_SETTINGS.tiers)];
    if (newTiers.length <= 1) return;
    newTiers.splice(index, 1);
    setSettings({ ...settings, tiers: newTiers });
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

  const tiers = settings.tiers && settings.tiers.length > 0
    ? settings.tiers
    : DEFAULT_HERO_SETTINGS.tiers;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
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
            Customize the iconic AJ Madison black banner, flash sale bar, typography, and tiered bundle discounts.
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
              ⚡ Real-Time Live Preview (Identical to Storefront)
            </span>
          </div>

          <div
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-medium)',
              background: '#000000',
              padding: '1.25rem',
            }}
          >
            {/* Top Flash Sale Strip */}
            {settings.flashSaleActive !== false && (
              <div className={heroStyles.flashBar}>
                <div className={heroStyles.flashLeft}>
                  <span className={heroStyles.flashBadge}>
                    {settings.flashSaleBadge || 'FLASH SALE'}
                  </span>
                  <div className={heroStyles.flashImageWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.flashSaleImage || '/images/hero_flash_appliances.png'}
                      alt="Flash Appliances"
                      className={heroStyles.flashImage}
                    />
                  </div>
                </div>

                <div className={heroStyles.flashCenter}>
                  {settings.flashSaleText || 'EXCLUSIVE LIMITED-TIME DEALS ONLY AT AJM'}
                </div>

                <div className={heroStyles.flashRight}>
                  <span className={heroStyles.flashButton}>
                    {settings.flashSaleButtonText || 'SHOP NOW'}
                  </span>
                </div>
              </div>
            )}

            {/* Main 3-Column Banner */}
            <div className={heroStyles.mainBanner}>
              {/* Left Column */}
              <div className={heroStyles.leftCol}>
                <div className={heroStyles.heading1}>{settings.headingLine1 || 'New Season.'}</div>
                <div className={heroStyles.heading2}>{settings.headingLine2 || 'Fresh Savings.'}</div>

                <div className={heroStyles.discountBox}>
                  <div className={heroStyles.upToLabel}>{settings.discountPrefix || 'UP TO'}</div>
                  <div className={heroStyles.discountVal}>{settings.discountValue || '50% OFF'}</div>
                </div>

                <span className={heroStyles.ctaLink}>
                  {settings.ctaText || 'SHOP ALL DEALS NOW →'}
                </span>
              </div>

              {/* Center Column */}
              <div className={heroStyles.centerCol}>
                <div className={heroStyles.centerFrame}>
                  <div className={heroStyles.centerImageWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.centerImage || '/images/hero_center_kitchen.png'}
                      alt="Designer Picks"
                      className={heroStyles.centerImage}
                    />
                  </div>
                  <div className={heroStyles.centerTag}>
                    {settings.centerImageTag || "DESIGNER PICKS, BEST-SELLERS & WHAT'S NEW"}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className={heroStyles.rightCol}>
                <div className={heroStyles.tierCard}>
                  <div className={heroStyles.tierHeader}>
                    <div>{settings.tierHeaderLine1 || 'THE MORE YOU BUY,'}</div>
                    <div>{settings.tierHeaderLine2 || 'THE MORE YOU SAVE™'}</div>
                  </div>
                  <div className={heroStyles.tierBody}>
                    {tiers.map((t, idx) => (
                      <div key={idx} className={heroStyles.tierRow}>
                        <span className={heroStyles.tierDiscount}>{t.discount}</span>
                        <span className={heroStyles.tierCondition}>{t.condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={heroStyles.tierFootnote}>
                  {settings.tierFootnote || '*ON QUALIFYING ITEMS'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONFIGURATION FORMS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Panel 1: Top Flash Sale Bar */}
        <div className={styles.tableCard} style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="#eab308" /> 1. Top Flash Sale Bar
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={settings.flashSaleActive !== false}
                onChange={(e) => setSettings({ ...settings, flashSaleActive: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
              />
              Show Flash Sale Bar on Homepage
            </label>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Flash Badge Text
              </label>
              <input
                type="text"
                value={settings.flashSaleBadge}
                onChange={(e) => setSettings({ ...settings, flashSaleBadge: e.target.value })}
                placeholder="FLASH SALE"
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Center Promotional Text
              </label>
              <input
                type="text"
                value={settings.flashSaleText}
                onChange={(e) => setSettings({ ...settings, flashSaleText: e.target.value })}
                placeholder="EXCLUSIVE LIMITED-TIME DEALS ONLY AT AJM"
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Button Text
                </label>
                <input
                  type="text"
                  value={settings.flashSaleButtonText}
                  onChange={(e) => setSettings({ ...settings, flashSaleButtonText: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Link URL
                </label>
                <input
                  type="text"
                  value={settings.flashSaleButtonLink}
                  onChange={(e) => setSettings({ ...settings, flashSaleButtonLink: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Flash appliances preview and upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Mini Appliances Icon / Thumbnail
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={settings.flashSaleImage}
                  onChange={(e) => setSettings({ ...settings, flashSaleImage: e.target.value })}
                  style={{ flex: 1, padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem', outline: 'none' }}
                />
                <input
                  type="file"
                  id="flashImageUpload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFlashImageUpload}
                />
                <label
                  htmlFor="flashImageUpload"
                  className="btn-outline"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Upload size={14} /> Upload
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Left Column (Typography & Discount Box) */}
        <div className={styles.tableCard} style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Type size={18} color="#2563eb" /> 2. Left Column (Headlines & Discount)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Heading Line 1 (White Serif)
              </label>
              <input
                type="text"
                value={settings.headingLine1}
                onChange={(e) => setSettings({ ...settings, headingLine1: e.target.value })}
                placeholder="New Season."
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#65a30d', marginBottom: '0.35rem' }}>
                Heading Line 2 (Chartreuse Italic Serif)
              </label>
              <input
                type="text"
                value={settings.headingLine2}
                onChange={(e) => setSettings({ ...settings, headingLine2: e.target.value })}
                placeholder="Fresh Savings."
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1.5px solid #bef264', fontSize: '0.86rem', outline: 'none', background: '#f7fee7' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Vertical Prefix
                </label>
                <input
                  type="text"
                  value={settings.discountPrefix}
                  onChange={(e) => setSettings({ ...settings, discountPrefix: e.target.value })}
                  placeholder="UP TO"
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Big Discount Value
                </label>
                <input
                  type="text"
                  value={settings.discountValue}
                  onChange={(e) => setSettings({ ...settings, discountValue: e.target.value })}
                  placeholder="50% OFF"
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none', fontWeight: 800 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  CTA Link Text
                </label>
                <input
                  type="text"
                  value={settings.ctaText}
                  onChange={(e) => setSettings({ ...settings, ctaText: e.target.value })}
                  placeholder="SHOP ALL DEALS NOW →"
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  CTA Link Target
                </label>
                <input
                  type="text"
                  value={settings.ctaLink}
                  onChange={(e) => setSettings({ ...settings, ctaLink: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Center Column (Matted Photo & Ribbon) */}
        <div className={styles.tableCard} style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layout size={18} color="#2563eb" /> 3. Center Matted Frame & Photo
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Bottom Ribbon Caption
              </label>
              <input
                type="text"
                value={settings.centerImageTag}
                onChange={(e) => setSettings({ ...settings, centerImageTag: e.target.value })}
                placeholder="DESIGNER PICKS, BEST-SELLERS & WHAT'S NEW"
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Frame Click Destination Link
              </label>
              <input
                type="text"
                value={settings.centerLink}
                onChange={(e) => setSettings({ ...settings, centerLink: e.target.value })}
                placeholder="/kitchen-packages"
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Center Showcase Photo (URL or File Upload)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={settings.centerImage}
                  onChange={(e) => setSettings({ ...settings, centerImage: e.target.value })}
                  placeholder="Image URL..."
                  style={{ flex: 1, padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
                />
                <input
                  type="file"
                  id="centerImageUpload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleCenterImageUpload}
                />
                <label
                  htmlFor="centerImageUpload"
                  className="btn-outline"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Upload size={14} /> Upload
                </label>
              </div>

              {/* Thumbnail */}
              <div
                style={{
                  marginTop: '0.75rem',
                  position: 'relative',
                  width: '100%',
                  height: '140px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-medium)',
                  background: '#f8fafc',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.centerImage}
                  alt="Thumbnail"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 4: Right Column (Tiered Savings Table) */}
        <div className={styles.tableCard} style={{ gridColumn: '1 / -1', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#2563eb" /> 4. Right Column: Tiered Savings Matrix (The More You Buy, The More You Save™)
            </h3>
            <button
              type="button"
              onClick={handleAddTier}
              className="btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Tier Row
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Header Line 1
              </label>
              <input
                type="text"
                value={settings.tierHeaderLine1}
                onChange={(e) => setSettings({ ...settings, tierHeaderLine1: e.target.value })}
                placeholder="THE MORE YOU BUY,"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Header Line 2
              </label>
              <input
                type="text"
                value={settings.tierHeaderLine2}
                onChange={(e) => setSettings({ ...settings, tierHeaderLine2: e.target.value })}
                placeholder="THE MORE YOU SAVE™"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Bottom Footnote
              </label>
              <input
                type="text"
                value={settings.tierFootnote}
                onChange={(e) => setSettings({ ...settings, tierFootnote: e.target.value })}
                placeholder="*ON QUALIFYING ITEMS"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Tier Rows List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.65rem 1rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', width: '60px' }}>
                  Tier #{idx + 1}
                </span>

                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={tier.discount}
                    onChange={(e) => handleTierChange(idx, 'discount', e.target.value)}
                    placeholder="e.g. $1,000 OFF"
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>

                <div style={{ flex: 1.5 }}>
                  <input
                    type="text"
                    value={tier.condition}
                    onChange={(e) => handleTierChange(idx, 'condition', e.target.value)}
                    placeholder="e.g. WHEN YOU BUY 6"
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTier(idx)}
                  className="btn-outline"
                  style={{ padding: '0.4rem', color: '#ef4444', borderColor: '#fca5a5' }}
                  title="Delete Tier Row"
                  disabled={tiers.length <= 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
