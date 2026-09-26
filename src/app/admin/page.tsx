'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Truck,
  AlertTriangle,
  Clock,
  DollarSign,
  Search,
  Filter,
  Eye,
  CheckCircle,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';
import styles from './admin.module.css';
import { supabase, isSupabaseConfigured, BookingRecord } from '@/lib/supabase';
import CustomDropdown, { DropdownOption } from '@/components/CustomDropdown';

const STATUS_FILTER_OPTIONS: DropdownOption[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'Pending Review', label: 'Pending Review', color: '#f59e0b' },
  { value: 'Confirmed', label: 'Confirmed', color: '#3b82f6' },
  { value: 'Shipped / Dispatched', label: 'Shipped / Bhej Diya', color: '#10b981' },
  { value: 'In Dispute', label: 'In Dispute / Masla', color: '#ef4444' },
  { value: 'Completed', label: 'Completed', color: '#8b5cf6' },
];

const TABLE_STATUS_OPTIONS: DropdownOption[] = [
  { value: 'Pending Review', label: 'Pending', color: '#f59e0b' },
  { value: 'Confirmed', label: 'Confirmed', color: '#3b82f6' },
  { value: 'Shipped / Dispatched', label: 'Shipped', color: '#10b981' },
  { value: 'In Dispute', label: 'In Dispute', color: '#ef4444' },
  { value: 'Completed', label: 'Completed', color: '#8b5cf6' },
];

// Initial sample mock bookings so the dashboard is immediately populated with realistic data
const INITIAL_DEMO_BOOKINGS: BookingRecord[] = [
  {
    id: 'demo-1',
    booking_ref: 'AJM-BK-91823',
    customer_name: 'David Miller',
    customer_email: 'david.m@example.com',
    customer_phone: '(555) 234-8901',
    delivery_address: '742 Evergreen Terrace, Brooklyn, NY',
    zip_code: '11230',
    delivery_type: 'White-Glove Unpack & Haul Away',
    preferred_date: '2026-10-02',
    notes: 'Please call 30 minutes before arrival. Gate code #4912.',
    total_price: 2498,
    status: 'Shipped / Dispatched', // "ye bhej dya h"
    created_at: '2026-09-25T14:20:00Z',
    items: [
      {
        productId: 'samsung-4-piece-french-door-kitchen-suite',
        productName: 'Samsung 4-Piece Kitchen Appliance Suite',
        brand: 'Samsung',
        modelNumber: 'PKG-SS-4PC-STEEL',
        price: 2498,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'demo-2',
    booking_ref: 'AJM-BK-74910',
    customer_name: 'Sarah Jenkins',
    customer_email: 'sjenkins@architects.com',
    customer_phone: '(555) 491-0022',
    delivery_address: '1400 K Street NW, Suite 600, Washington, DC',
    zip_code: '20005',
    delivery_type: 'Room of Choice Placement',
    preferred_date: '2026-10-05',
    notes: 'Freight elevator reserved from 10am to 2pm.',
    total_price: 13200,
    status: 'In Dispute', // "ye order dispute me h"
    created_at: '2026-09-24T09:15:00Z',
    items: [
      {
        productId: 'wolf-gr488-pro-gas-range',
        productName: 'Wolf 48" Professional Gas Range with 8 Dual-Stacked Burners',
        brand: 'Wolf',
        modelNumber: 'GR488',
        price: 13200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'demo-3',
    booking_ref: 'AJM-BK-58291',
    customer_name: 'Robert Zhang',
    customer_email: 'rzhang@verizon.net',
    customer_phone: '(555) 882-1923',
    delivery_address: '88 Park Avenue, Manhattan, NY',
    zip_code: '10016',
    delivery_type: 'Standard Delivery (Curbside/Threshold)',
    preferred_date: '2026-09-30',
    notes: 'Deliver to building doorman.',
    total_price: 1299,
    status: 'Pending Review',
    created_at: '2026-09-26T11:45:00Z',
    items: [
      {
        productId: 'bosch-shp78cm5n-800-series',
        productName: 'Bosch 800 Series 24" Top Control Dishwasher',
        brand: 'Bosch',
        modelNumber: 'SHP78CM5N',
        price: 1299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'demo-4',
    booking_ref: 'AJM-BK-40194',
    customer_name: 'Elena Rostova',
    customer_email: 'elena.rostova@design.com',
    customer_phone: '(555) 773-4011',
    delivery_address: '420 Lincoln Road, Miami Beach, FL',
    zip_code: '33139',
    delivery_type: 'White-Glove Unpack & Haul Away',
    preferred_date: '2026-10-12',
    notes: 'Contact designer for onsite approval.',
    total_price: 11450,
    status: 'Confirmed',
    created_at: '2026-09-23T16:30:00Z',
    items: [
      {
        productId: 'sub-zero-cl3650uo-classic-refrigerator',
        productName: 'Sub-Zero Classic Series 36" Built-In French Door Refrigerator',
        brand: 'Sub-Zero',
        modelNumber: 'CL3650U/O',
        price: 11450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
];

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Fetch bookings from Supabase or localStorage
  const loadBookings = async () => {
    setLoading(true);
    let allBookings: BookingRecord[] = [];

    // 1. Try fetching from Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          allBookings = data as BookingRecord[];
        }
      } catch (err) {
        console.warn('Supabase bookings fetch failed, falling back to local storage:', err);
      }
    }

    // 2. Load from localStorage if any customer created bookings locally
    try {
      const savedLocal = JSON.parse(localStorage.getItem('ajm_local_bookings') || '[]');
      if (savedLocal.length > 0) {
        // Merge without duplicate booking_ref
        const existingRefs = new Set(allBookings.map((b) => b.booking_ref));
        savedLocal.forEach((b: BookingRecord) => {
          if (!existingRefs.has(b.booking_ref)) {
            allBookings.push(b);
          }
        });
      }
    } catch {
      // ignore
    }

    // 3. If still empty, seed with demo bookings so admin can test status changes immediately
    if (allBookings.length === 0) {
      allBookings = INITIAL_DEMO_BOOKINGS;
    }

    setBookings(allBookings);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Update status (e.g. "Shipped / Bhej diya", "In Dispute", etc.)
  const handleStatusChange = async (bookingRef: string, newStatus: BookingRecord['status']) => {
    // Update local state immediately
    const updated = bookings.map((b) =>
      b.booking_ref === bookingRef ? { ...b, status: newStatus } : b
    );
    setBookings(updated);

    if (selectedBooking && selectedBooking.booking_ref === bookingRef) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }

    // Update in Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('bookings')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('booking_ref', bookingRef);
      } catch (err) {
        console.error('Failed to update status in Supabase:', err);
      }
    }

    // Also update localStorage backup
    try {
      const local = JSON.parse(localStorage.getItem('ajm_local_bookings') || '[]');
      const updatedLocal = local.map((b: BookingRecord) =>
        b.booking_ref === bookingRef ? { ...b, status: newStatus } : b
      );
      localStorage.setItem('ajm_local_bookings', JSON.stringify(updatedLocal));
    } catch {
      // ignore
    }
  };

  // Metrics computation
  const stats = useMemo(() => {
    const totalCount = bookings.length;
    const shippedCount = bookings.filter((b) => b.status === 'Shipped / Dispatched').length;
    const disputeCount = bookings.filter((b) => b.status === 'In Dispute').length;
    const pendingCount = bookings.filter((b) => b.status === 'Pending Review' || b.status === 'Confirmed').length;
    const totalVolume = bookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

    return { totalCount, shippedCount, disputeCount, pendingCount, totalVolume };
  }, [bookings]);

  // Filtering
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.booking_ref.toLowerCase().includes(q) ||
          b.customer_name.toLowerCase().includes(q) ||
          b.customer_email.toLowerCase().includes(q) ||
          b.customer_phone.toLowerCase().includes(q) ||
          b.zip_code.includes(q)
        );
      }
      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  return (
    <div>
      {/* 1. TOP METRICS CARDS */}
      <div className={styles.statsGrid}>
        {/* Total Bookings */}
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Bookings</span>
            <span className={styles.statValue}>{stats.totalCount}</span>
          </div>
          <div className={styles.statIconWrap} style={{ background: '#e0e7ff', color: 'var(--primary-navy)' }}>
            <CalendarCheck size={24} />
          </div>
        </div>

        {/* Shipped / Bhej Diya */}
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Bhej Diya (Shipped)</span>
            <span className={styles.statValue} style={{ color: '#15803d' }}>
              {stats.shippedCount}
            </span>
          </div>
          <div className={styles.statIconWrap} style={{ background: '#dcfce7', color: '#16a34a' }}>
            <Truck size={24} />
          </div>
        </div>

        {/* In Dispute */}
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Dispute Me Hai</span>
            <span className={styles.statValue} style={{ color: '#b91c1c' }}>
              {stats.disputeCount}
            </span>
          </div>
          <div className={styles.statIconWrap} style={{ background: '#fee2e2', color: '#dc2626' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        {/* Pending & Confirmed */}
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Pending / Confirmed</span>
            <span className={styles.statValue} style={{ color: '#b45309' }}>
              {stats.pendingCount}
            </span>
          </div>
          <div className={styles.statIconWrap} style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
        </div>

        {/* Total Value */}
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Pipeline Value</span>
            <span className={styles.statValue} style={{ fontSize: '1.5rem', color: 'var(--primary-navy)' }}>
              ${stats.totalVolume.toLocaleString()}
            </span>
          </div>
          <div className={styles.statIconWrap} style={{ background: '#f3e8ff', color: '#7e22ce' }}>
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* 2. BOOKINGS TABLE & STATUS CONTROLS */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <div>
            <h2 className={styles.tableTitle}>Customer Appliance Bookings</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Manage reservation status, delivery dispatch, and customer disputes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Box */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search Ref, Name, Phone, ZIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.55rem 0.75rem 0.55rem 2.2rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', outline: 'none' }}
              />
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Filter by Status */}
            <CustomDropdown
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            <button
              onClick={loadBookings}
              className="btn-outline"
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem' }}
              title="Refresh Bookings"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Booking Ref #</th>
                <th>Customer</th>
                <th>Delivery Address</th>
                <th>Appliances</th>
                <th>Total Value</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.booking_ref}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-navy)' }}>
                        {b.booking_ref}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{b.customer_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.customer_phone}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.customer_email}</div>
                    </td>

                    <td>
                      <div style={{ maxWidth: '200px', fontSize: '0.82rem' }}>
                        {b.delivery_address}
                        <br />
                        <strong>ZIP: {b.zip_code}</strong>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--primary-navy)', background: '#e0e7ff', padding: '1px 6px', borderRadius: '4px' }}>
                        {b.delivery_type}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {b.items.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                            <strong>{item.brand}</strong> {item.modelNumber} (x{item.quantity})
                          </div>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                        ${Number(b.total_price).toLocaleString()}
                      </span>
                    </td>

                    {/* Status Dropdown - Direct update! */}
                    <td>
                      <CustomDropdown
                        size="sm"
                        options={TABLE_STATUS_OPTIONS}
                        value={b.status}
                        onChange={(val) => handleStatusChange(b.booking_ref, val as BookingRecord['status'])}
                      />
                    </td>

                    <td>
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="btn-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={13} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 4000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '2rem',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Booking Reference
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                  {selectedBooking.booking_ref}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ padding: '0.5rem', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Status:</span>
                <div style={{ fontWeight: 800, color: 'var(--primary-navy)' }}>{selectedBooking.status}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleStatusChange(selectedBooking.booking_ref, 'Shipped / Dispatched')}
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', background: '#16a34a', borderColor: '#16a34a' }}
                >
                  <Truck size={14} /> Mark as Bhej Diya
                </button>
                <button
                  onClick={() => handleStatusChange(selectedBooking.booking_ref, 'In Dispute')}
                  className="btn-red"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <AlertTriangle size={14} /> Mark In Dispute
                </button>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Customer Details
                </h4>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{selectedBooking.customer_name}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Email: {selectedBooking.customer_email}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Phone: {selectedBooking.customer_phone}</div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Delivery Destination
                </h4>
                <div style={{ fontSize: '0.9rem' }}>{selectedBooking.delivery_address}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>ZIP: {selectedBooking.zip_code}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--primary-navy)', marginTop: '4px' }}>
                  Tier: {selectedBooking.delivery_type}
                </div>
              </div>
            </div>

            {selectedBooking.notes && (
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#92400e' }}>
                <strong>Customer Notes:</strong> {selectedBooking.notes}
              </div>
            )}

            {/* Reserved Items */}
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Reserved Appliances ({selectedBooking.items.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedBooking.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      {item.brand} - {item.productName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Model: #{item.modelNumber} · Quantity: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-navy)' }}>
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed var(--border-medium)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Booking Amount:</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                ${Number(selectedBooking.total_price).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
