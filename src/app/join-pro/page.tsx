import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Percent, Phone, Building, ArrowRight, Check } from 'lucide-react';

export default function JoinProPage() {
  return (
    <div style={{ padding: '3.5rem 0 5rem', backgroundColor: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.75rem', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            AJ Madison Trade & Pro
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: '1.2' }}>
            Built for Builders, Designers & Remodelers
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem', maxWidth: '650px', marginInline: 'auto' }}>
            Join over 25,000 trade professionals who depend on AJ Madison for commercial pricing, dedicated account managers, and nationwide project logistics.
          </p>
        </div>

        {/* Benefits Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <Percent size={28} color="var(--primary-navy)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Exclusive Trade Pricing
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Deep wholesale margins on luxury suites, kitchen packages, and bulk laundry units.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <Building size={28} color="var(--primary-navy)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Dedicated Account Manager
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Direct access to appliance specialists who prepare spec books and verify cutouts.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <Truck size={28} color="var(--primary-navy)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Jobsite Staged Delivery
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              We store and coordinate timed phased deliveries directly to residential or commercial jobsites.
            </p>
          </div>
        </div>

        {/* Registration Card */}
        <div style={{ background: 'linear-gradient(135deg, #0e1738, #1a2b6d)', color: 'white', padding: '2.5rem', borderRadius: '16px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Apply for Your AJ Madison Pro Account
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1.75rem', maxWidth: '520px', marginInline: 'auto' }}>
            Instant preliminary approval with valid Tax ID, Contractor License, or Interior Design Certification.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:8005703355" className="btn-red" style={{ padding: '0.85rem 1.75rem' }}>
              <Phone size={18} /> Call Pro Desk: 800-570-3355
            </a>
            <Link href="/" className="btn-outline-white">
              Browse Available Packages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
