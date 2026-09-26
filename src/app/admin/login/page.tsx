'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Shield,
  ArrowRight,
  AlertCircle,
  UserPlus,
  LogIn,
  User,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminAuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Form states
  const [email, setEmail] = useState('admin@ajmadison.com');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('ADMIN2026');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (data?.session) {
          localStorage.setItem(
            'ajm_admin_session',
            JSON.stringify({
              email: data.user.email,
              name: data.user.user_metadata?.full_name || 'Admin',
              role: 'admin',
            })
          );
          router.push('/admin');
          return;
        }

        // If credentials are the default demo
        if (email === 'admin@ajmadison.com' && password === 'admin123') {
          localStorage.setItem(
            'ajm_admin_session',
            JSON.stringify({ email, name: 'Lead Administrator', role: 'admin' })
          );
          router.push('/admin');
          return;
        }

        if (sbError) {
          // Check if it's a locally created account in localStorage
          const localAccounts = JSON.parse(localStorage.getItem('ajm_registered_admins') || '[]');
          const match = localAccounts.find((a: any) => a.email === email && a.password === password);
          if (match) {
            localStorage.setItem(
              'ajm_admin_session',
              JSON.stringify({ email: match.email, name: match.name, role: 'admin' })
            );
            router.push('/admin');
            return;
          }

          setError(sbError.message);
          setLoading(false);
          return;
        }
      } else {
        // Fallback local auth
        const localAccounts = JSON.parse(localStorage.getItem('ajm_registered_admins') || '[]');
        const match = localAccounts.find((a: any) => a.email === email && a.password === password);

        if (match || (email === 'admin@ajmadison.com' && password === 'admin123')) {
          localStorage.setItem(
            'ajm_admin_session',
            JSON.stringify({ email, name: match?.name || 'Administrator', role: 'admin' })
          );
          router.push('/admin');
          return;
        }

        setError('Invalid admin credentials. Use default demo or create a new account.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Admin Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // Security check: Ensure admin passcode matches
    if (adminKey.trim().toUpperCase() !== 'ADMIN2026') {
      setError('Invalid Admin Security Passcode. Use ADMIN2026 to verify admin privileges.');
      setLoading(false);
      return;
    }

    try {
      // Register in Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data, error: sbError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'admin',
            },
          },
        });

        if (sbError) {
          console.warn('Supabase sign-up note:', sbError);
        }
      }

      // Save admin profile locally as backup
      const existingAdmins = JSON.parse(localStorage.getItem('ajm_registered_admins') || '[]');
      existingAdmins.push({ name: fullName, email, password });
      localStorage.setItem('ajm_registered_admins', JSON.stringify(existingAdmins));

      // Auto sign-in
      localStorage.setItem(
        'ajm_admin_session',
        JSON.stringify({ email, name: fullName, role: 'admin' })
      );

      setSuccessMsg('Admin account registered successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d1740 0%, #1a2b6d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '480px',
          width: '100%',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: '#e0e7ff',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}
          >
            <Shield size={28} color="var(--primary-navy)" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--primary-navy)',
            }}
          >
            AJ Madison Admin Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Bookings, Inventory & Supabase Control
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'login' ? '#ffffff' : 'transparent',
              color: activeTab === 'login' ? 'var(--primary-navy)' : 'var(--text-muted)',
              boxShadow: activeTab === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <LogIn size={16} /> Sign In
          </button>

          <button
            onClick={() => {
              setActiveTab('signup');
              setError(null);
              setEmail('');
              setPassword('');
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'signup' ? '#ffffff' : 'transparent',
              color: activeTab === 'signup' ? 'var(--primary-navy)' : 'var(--text-muted)',
              boxShadow: activeTab === 'signup' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#b91c1c',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '0.4rem',
                }}
              >
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                  }}
                />
                <Mail
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Password
                </label>
                <Link
                  href="/admin/forgot-password"
                  style={{ fontSize: '0.8rem', color: 'var(--primary-navy)', fontWeight: 600 }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                  }}
                />
                <Lock
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div
              style={{
                background: '#f8fafc',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              <strong>Default Demo Admin:</strong>
              <br />
              Email: <code>admin@ajmadison.com</code> | Pass: <code>admin123</code>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'} <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          /* 2. SIGN UP FORM */
          <form onSubmit={handleSignUp}>
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '0.35rem',
                }}
              >
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.75rem 0.7rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                  }}
                />
                <User
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '0.35rem',
                }}
              >
                Work Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="you@ajmadison.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.75rem 0.7rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                  }}
                />
                <Mail
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Confirm *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: '0.35rem',
                }}
              >
                Admin Security Passcode *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="ADMIN2026"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.75rem 0.7rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                />
                <Key
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                Security passkey: <code>ADMIN2026</code> (prevents unauthorized public sign-ups)
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {loading ? 'Creating Account...' : 'Register New Admin Account'} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Back Link */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ← Back to AJ Madison Public Store
          </Link>
        </div>
      </div>
    </div>
  );
}
