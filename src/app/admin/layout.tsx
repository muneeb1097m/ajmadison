'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ExternalLink,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name?: string } | null>(null);

  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/forgot-password';

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem('ajm_admin_session');

    if (!session && !isAuthPage) {
      router.push('/admin/login');
    } else if (session) {
      try {
        setAdminUser(JSON.parse(session));
      } catch {
        setAdminUser(null);
      }
    }
  }, [pathname, isAuthPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('ajm_admin_session');
    setAdminUser(null);
    router.push('/admin/login');
  };

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#0d1740' }} />;
  }

  // If on login or forgot-password, render only the auth card
  if (isAuthPage) {
    return <>{children}</>;
  }

  // If not logged in, prevent rendering protected admin dashboard
  if (!adminUser) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1740', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', gap: '1rem' }}>
        <Shield size={36} color="#ffde59" />
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>Verifying Admin Credentials...</div>
      </div>
    );
  }

  return (
    <div className={styles.adminWrapper}>
      {/* Admin Sidebar */}
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarHeader}>
          <Shield size={24} color="#ffde59" />
          <div className={styles.sidebarBrandText}>
            <div className={styles.sidebarBrand}>ajmadison</div>
            <span className={styles.adminBadge}>Admin Portal</span>
          </div>
        </div>

        {/* User Card in Sidebar with Sign Out right at the top */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
              {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {adminUser.name || 'Lead Administrator'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {adminUser.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={styles.topLogoutBtn}
            title="Sign Out from Admin Portal"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>

        <nav className={styles.navSection}>
          <Link
            href="/admin"
            className={`${styles.navLink} ${pathname === '/admin' ? styles.navLinkActive : ''}`}
          >
            <LayoutDashboard size={18} />
            <span className={styles.navLabel}>Bookings Dashboard</span>
          </Link>

          <Link
            href="/admin/products"
            className={`${styles.navLink} ${pathname === '/admin/products' ? styles.navLinkActive : ''}`}
          >
            <Package size={18} />
            <span className={styles.navLabel}>Products Catalog</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" className={styles.viewStoreBtn}>
            <ExternalLink size={15} />
            <span className={styles.navLabel}>View Live Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className={styles.adminMain}>
        <header className={styles.adminTopbar}>
          <h1 className={styles.topbarTitle}>
            {pathname === '/admin/products'
              ? 'Appliance Inventory & Management'
              : 'Bookings & Fulfillment Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <span>Supabase Connected</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: '#ef4444',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </header>

        <div className={styles.adminBody}>{children}</div>
      </div>
    </div>
  );
}
