'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  CalendarCheck,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ArrowRight,
  Clock,
} from 'lucide-react';
import styles from './BookingModal.module.css';
import { useCart } from '@/context/CartContext';
import { supabase, isSupabaseConfigured, BookingRecord } from '@/lib/supabase';
import CustomDropdown, { DropdownOption } from './CustomDropdown';

const DELIVERY_TIER_OPTIONS: DropdownOption[] = [
  {
    value: 'Standard Delivery (Curbside/Threshold)',
    label: 'Standard Nationwide Delivery (FREE on $999+)',
  },
  {
    value: 'Room of Choice Placement',
    label: 'Room of Choice Placement (+$99)',
  },
  {
    value: 'White-Glove Unpack & Haul Away',
    label: 'White-Glove Unpack, Leveling & Haul Away (+$199)',
  },
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { items, subtotal, clearCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('10001');
  const [deliveryType, setDeliveryType] = useState('Standard Delivery (Curbside/Threshold)');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `AJM-BK-${randomSuffix}`;

    const bookingPayload: BookingRecord = {
      booking_ref: bookingRef,
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone,
      delivery_address: address,
      zip_code: zipCode,
      delivery_type: deliveryType,
      preferred_date: preferredDate,
      notes: notes,
      total_price: subtotal,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        modelNumber: item.product.modelNumber,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      status: 'Pending Review',
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('bookings').insert([bookingPayload]);
        if (error) {
          console.error('Supabase booking insert error:', error);
          saveToLocalStorage(bookingPayload);
        }
      } else {
        saveToLocalStorage(bookingPayload);
      }

      setConfirmedBookingRef(bookingRef);
      clearCart();
    } catch (err) {
      console.error('Error creating booking:', err);
      saveToLocalStorage(bookingPayload);
      setConfirmedBookingRef(bookingRef);
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (booking: BookingRecord) => {
    try {
      const existing = JSON.parse(localStorage.getItem('ajm_local_bookings') || '[]');
      existing.unshift({ ...booking, created_at: new Date().toISOString() });
      localStorage.setItem('ajm_local_bookings', JSON.stringify(existing));
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <CalendarCheck size={22} color="var(--primary-navy)" />
            <span>Appliance Reservation & Delivery Booking</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {confirmedBookingRef ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                Booking Successfully Placed!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Your appliance reservation has been forwarded to our fulfillment and logistics dispatch desk.
              </p>

              <div>
                <span className={styles.refBadge}>{confirmedBookingRef}</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                A confirmation has been recorded for <strong>{email}</strong>. Our logistics specialist will contact you at <strong>{phone}</strong> to confirm the delivery window and verify dimensions.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/order-status"
                  onClick={onClose}
                  className="btn-primary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Track in Order Status
                </Link>
                <button
                  onClick={onClose}
                  className="btn-outline"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Order Items Preview */}
              <div className={styles.orderSummaryCard}>
                <div className={styles.summaryHeader}>
                  <span>Selected Appliances ({items.length})</span>
                  <span>Est. Total: ${subtotal.toLocaleString()}</span>
                </div>
                <div className={styles.itemsMiniList}>
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className={styles.miniItemRow}>
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                        {product.brand} - {product.name} (x{quantity})
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>
                        ${(product.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Customer Form */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number (For Delivery Confirmation) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Delivery ZIP Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="10001"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Delivery Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Appliance Way, Apt 4B, City, State"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Delivery Service Tier</label>
                  <CustomDropdown
                    fullWidth
                    options={DELIVERY_TIER_OPTIONS}
                    value={deliveryType}
                    onChange={setDeliveryType}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Preferred Delivery Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Special Delivery Instructions / Gate Code / Elevator Notes</label>
                  <textarea
                    placeholder="Please specify any tight doorways, stairs, or contact instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={styles.textarea}
                  />
                </div>
              </div>

              {/* Guarantees */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={18} color="var(--primary-navy)" />
                <span>Zero Obligation Booking · Factory Authorized Dealer · Lock In Current Closeout Prices</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? 'Submitting Booking...' : 'Confirm & Reserve Appliance Booking'} <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
