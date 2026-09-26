'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // For admin pages, do NOT show store header, footer, or cart drawer
    return <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>{children}</div>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <CartDrawer />
      <Footer />
    </>
  );
}
