'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Search, Truck, CheckCircle2 } from 'lucide-react';

export default function OrderStatusPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [emailOrZip, setEmailOrZip] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && emailOrZip) {
      setSearched(true);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem', backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Package size={44} color="var(--primary-navy)" style={{ marginBottom: '0.75rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
            Track Your Order
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            Check the live delivery status of your appliances or kitchen packages.
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <form onSubmit={handleTrack}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                AJ Madison Order #
              </label>
              <input
                type="text"
                placeholder="e.g. AJM-98421"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Billing Email or Delivery ZIP
              </label>
              <input
                type="text"
                placeholder="e.g. 10001 or email@example.com"
                value={emailOrZip}
                onChange={(e) => setEmailOrZip(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
              <Search size={18} /> Locate Order Status
            </button>
          </form>

          {searched && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, marginBottom: '0.5rem' }}>
                <CheckCircle2 size={18} /> Order #{orderNumber.toUpperCase()} Found
              </div>
              <p style={{ fontSize: '0.9rem', color: '#15803d', marginBottom: '1rem' }}>
                Status: <strong>Shipped & In Transit with Nationwide White-Glove Carrier</strong>
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Estimated Delivery Window: <strong>Monday, 9:00 AM - 1:00 PM</strong>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Need assistance with delivery scheduling? <a href="tel:8005703355" style={{ color: 'var(--primary-navy)', fontWeight: 600 }}>Call 800-570-3355</a>
        </div>
      </div>
    </div>
  );
}
