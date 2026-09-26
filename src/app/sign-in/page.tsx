'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setSignedIn(true);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem', backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <User size={28} color="var(--primary-navy)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
            Sign In to AJ Madison
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Access saved quotes, track shipments, and manage your appliance warranties.
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          {signedIn ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ color: '#16a34a', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                ✓ Welcome Back!
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                You have successfully signed in with {email}.
              </p>
              <Link href="/" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary-navy)', fontWeight: 600 }}>
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
                Sign In <ArrowRight size={16} />
              </button>
            </form>
          )}

          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Don&apos;t have an account yet?{' '}
              <Link href="/join-pro" style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>
                Create Account or Join Pro
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
