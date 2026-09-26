import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StoreShell from '@/components/StoreShell';

export const metadata: Metadata = {
  title: 'AJ Madison | The Appliance Authority - Washers, Dishwashers, Packages & Luxury Appliances',
  description:
    'Shop discounted closeout deals, premium washers and dryers, whisper-quiet dishwashers, full kitchen packages, luxury appliances, and countertop small appliances at AJ Madison.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <StoreShell>{children}</StoreShell>
        </CartProvider>
      </body>
    </html>
  );
}
