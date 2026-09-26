'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import styles from './CartDrawer.module.css';
import { useCart } from '@/context/CartContext';

import BookingModal from '@/components/BookingModal';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    totalSavings,
  } = useCart();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  if (!isOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleOpenBooking = () => {
    setBookingModalOpen(true);
  };

  return (
    <>
      <div className={styles.overlay} onClick={closeCart} />
      <div className={styles.drawer} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <ShoppingBag size={20} />
            <span>Your Shopping Cart</span>
            <span className={styles.itemCountBadge}>{totalItems} items</span>
          </div>
          <button
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className={styles.shippingBar}>
          <div className={styles.shippingText}>
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong>${remainingForFreeShipping.toLocaleString()}</strong> more to qualify for <strong>FREE Nationwide Delivery</strong>
              </span>
            ) : (
              <span style={{ color: '#16a34a' }}>
                🎉 You qualified for <strong>FREE Nationwide Delivery!</strong>
              </span>
            )}
          </div>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <ShoppingBag size={48} className={styles.emptyIcon} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Your cart is empty
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>
              Discover our exclusive closeouts, laundry pairs, and kitchen packages.
            </p>
            <button
              onClick={closeCart}
              className="btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className={styles.itemsList}>
              {items.map(({ product, quantity }) => (
                <div key={product.id} className={styles.cartItem}>
                  <div className={styles.itemImageWrap}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className={styles.itemImage}
                    />
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemBrand}>{product.brand}</div>
                    <Link
                      href={`/product/${product.id}`}
                      className={styles.itemName}
                      onClick={closeCart}
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                    <div className={styles.itemPrice}>
                      ${(product.price * quantity).toLocaleString()}
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.quantitySelector}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className={styles.qtyVal}>{quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout */}
            <div className={styles.footer}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              {totalSavings > 0 && (
                <div className={styles.savingsRow}>
                  <span>Total Savings</span>
                  <span>-${totalSavings.toLocaleString()}</span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>Nationwide Delivery</span>
                <span>{subtotal >= 999 ? 'FREE' : '$99'}</span>
              </div>

              <div className={styles.totalRow}>
                <span>Estimated Total</span>
                <span>${(subtotal + (subtotal >= 999 ? 0 : 99)).toLocaleString()}</span>
              </div>

              <button
                className={styles.checkoutBtn}
                onClick={handleOpenBooking}
              >
                Proceed to Appliance Booking <ArrowRight size={18} />
              </button>

              <div className={styles.securityNote}>
                <ShieldCheck size={14} color="#16a34a" />
                <span>Authorized Dealer · Zero Obligation Appliance Booking</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Appliance Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </>
  );
}
