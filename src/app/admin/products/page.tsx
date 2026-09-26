'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Tag,
  X,
  ExternalLink,
  RotateCcw,
  LayoutGrid,
  List,
  Upload,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import styles from '../admin.module.css';
import { PRODUCTS, Product } from '@/data/products';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import CustomDropdown, { DropdownOption } from '@/components/CustomDropdown';

const DEPARTMENT_NAMES: Record<string, string> = {
  'washers-dryers': 'Washers & Dryers',
  'dishwashers': 'Dishwashers',
  'kitchen-packages': 'Kitchen Packages',
  'luxury-appliances': 'Luxury Appliances',
  'small-appliances': 'Small Appliances',
};

const DEPARTMENT_FILTER_OPTIONS: DropdownOption[] = [
  { value: 'ALL', label: 'All Departments' },
  { value: 'washers-dryers', label: 'Washers & Dryers' },
  { value: 'dishwashers', label: 'Dishwashers' },
  { value: 'kitchen-packages', label: 'Kitchen Packages' },
  { value: 'luxury-appliances', label: 'Luxury Appliances' },
  { value: 'small-appliances', label: 'Small Appliances' },
];

const MODAL_CATEGORY_OPTIONS: DropdownOption[] = [
  { value: 'washers-dryers', label: 'Washers & Dryers' },
  { value: 'dishwashers', label: 'Dishwashers' },
  { value: 'kitchen-packages', label: 'Kitchen Packages' },
  { value: 'luxury-appliances', label: 'Luxury Appliances' },
  { value: 'small-appliances', label: 'Small Appliances' },
];

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'catalogue'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Pictures & gallery sequence state
  const [imageList, setImageList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddUrlImage = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setImageList((prev) => [...prev, trimmed]);
    setNewImageUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setImageList((prev) => [...prev, resultStr]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    setImageList((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const handleSetAsCover = (index: number) => {
    handleMoveImage(index, 0);
  };

  // Form states
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    modelNumber: '',
    category: 'washers-dryers',
    subCategory: 'Washing Machines',
    subCategorySlug: 'washing-machines',
    price: 999,
    originalPrice: 1299,
    isCloseout: false,
    closeoutBadge: '',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    description: '',
    specs: {},
  });

  // Load products (Supabase -> localStorage -> PRODUCTS)
  const loadProducts = async () => {
    let list: Product[] = [];

    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (data && !error && data.length > 0) {
          list = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            brand: d.brand,
            modelNumber: d.model_number,
            category: d.category,
            subCategory: d.sub_category,
            subCategorySlug: d.sub_category_slug,
            price: Number(d.price),
            originalPrice: Number(d.original_price),
            isCloseout: Boolean(d.is_closeout),
            closeoutBadge: d.closeout_badge || '',
            rating: Number(d.rating || 4.8),
            reviewsCount: Number(d.reviews_count || 10),
            image: d.image,
            gallery: d.gallery || [d.image],
            inStock: Boolean(d.in_stock),
            deliveryEstimate: d.delivery_estimate || 'Free Delivery in 2-4 Days',
            specs: d.specs || {},
            description: d.description || '',
          }));
        }
      } catch (err) {
        console.warn('Failed to load products from Supabase:', err);
      }
    }

    // 2. Check localStorage
    if (list.length === 0) {
      try {
        const local = localStorage.getItem('ajm_managed_products');
        if (local) {
          list = JSON.parse(local);
        }
      } catch {
        // ignore
      }
    }

    // 3. Fallback to hardcoded product catalog
    if (list.length === 0) {
      list = PRODUCTS;
    }

    setProductsList(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: '',
      name: '',
      brand: 'Bosch',
      modelNumber: '',
      category: 'washers-dryers',
      subCategory: 'Washing Machines',
      subCategorySlug: 'washing-machines',
      price: 899,
      originalPrice: 1199,
      isCloseout: false,
      closeoutBadge: 'Save $300',
      rating: 4.8,
      reviewsCount: 15,
      inStock: true,
      deliveryEstimate: 'Free Nationwide Delivery',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
      gallery: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80'],
      description: 'High efficiency appliance with state-of-the-art engineering.',
      specs: { dimensions: '27" W x 39" H', finish: 'Stainless Steel' },
    });
    const defaultImg = 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80';
    setImageList([defaultImg]);
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    const allImgs = Array.from(
      new Set([product.image, ...(product.gallery || [])])
    ).filter(Boolean);
    setImageList(allImgs.length > 0 ? allImgs : [product.image]);
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const productId =
      editingProduct?.id ||
      formData.id ||
      `${(formData.brand || 'appliance').toLowerCase()}-${(formData.modelNumber || Math.random().toString(36).substring(7)).toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const primaryImage =
      imageList[0] ||
      formData.image ||
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80';

    const completeProduct: Product = {
      id: productId,
      name: formData.name || 'Appliance Model',
      brand: formData.brand || 'Brand',
      modelNumber: formData.modelNumber || 'MODEL-100',
      category: formData.category as Product['category'],
      subCategory: formData.subCategory || 'General',
      subCategorySlug: formData.subCategorySlug || 'general',
      price: Number(formData.price || 0),
      originalPrice: Number(formData.originalPrice || formData.price || 0),
      isCloseout: Boolean(formData.isCloseout),
      closeoutBadge: formData.closeoutBadge || '',
      rating: formData.rating || 4.8,
      reviewsCount: formData.reviewsCount || 10,
      image: primaryImage,
      gallery: imageList.length > 0 ? imageList : [primaryImage],
      inStock: formData.inStock !== false,
      deliveryEstimate: formData.deliveryEstimate || 'Ships in 24-48 Hours',
      specs: formData.specs || {},
      description: formData.description || '',
    };

    let updatedList: Product[] = [];
    if (editingProduct) {
      updatedList = productsList.map((p) => (p.id === editingProduct.id ? completeProduct : p));
    } else {
      updatedList = [completeProduct, ...productsList];
    }

    setProductsList(updatedList);
    try {
      localStorage.setItem('ajm_managed_products', JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    // Save to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert({
          id: completeProduct.id,
          name: completeProduct.name,
          brand: completeProduct.brand,
          model_number: completeProduct.modelNumber,
          category: completeProduct.category,
          sub_category: completeProduct.subCategory,
          sub_category_slug: completeProduct.subCategorySlug,
          price: completeProduct.price,
          original_price: completeProduct.originalPrice,
          is_closeout: completeProduct.isCloseout,
          closeout_badge: completeProduct.closeoutBadge,
          rating: completeProduct.rating,
          reviews_count: completeProduct.reviewsCount,
          image: completeProduct.image,
          gallery: completeProduct.gallery,
          in_stock: completeProduct.inStock,
          delivery_estimate: completeProduct.deliveryEstimate,
          specs: completeProduct.specs,
          description: completeProduct.description,
        });
      } catch (err) {
        console.error('Supabase product save error:', err);
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;

    const filtered = productsList.filter((p) => p.id !== id);
    setProductsList(filtered);
    try {
      localStorage.setItem('ajm_managed_products', JSON.stringify(filtered));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete error:', err);
      }
    }
  };

  // Filtered
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.modelNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [productsList, categoryFilter, searchQuery]);

  return (
    <div>
      {/* Top Controls Bar */}
      <div className={styles.tableCard} style={{ marginBottom: '2rem' }}>
        <div className={styles.tableHeaderRow}>
          <div>
            <h2 className={styles.tableTitle}>Appliance Inventory ({productsList.length} items)</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Add new models, update closeout sale prices, and manage stock in Supabase.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* View Switcher: List vs Catalogue */}
            <div className={styles.viewToggleGroup}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                title="Table List View"
              >
                <List size={15} />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('catalogue')}
                className={`${styles.viewToggleBtn} ${viewMode === 'catalogue' ? styles.viewToggleBtnActive : ''}`}
                title="Catalogue Cards View"
              >
                <LayoutGrid size={15} />
                <span>Catalogue</span>
              </button>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search name, brand, model #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.55rem 0.75rem 0.55rem 2.2rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', outline: 'none' }}
              />
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Department Filter */}
            <CustomDropdown
              options={DEPARTMENT_FILTER_OPTIONS}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />

            <button
              onClick={openAddModal}
              className="btn-primary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.88rem' }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Content: List or Catalogue View */}
        {filteredProducts.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Package size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No appliances match your criteria</p>
            <p style={{ fontSize: '0.82rem' }}>Try clearing your search query or selecting &quot;All Departments&quot;.</p>
          </div>
        ) : viewMode === 'catalogue' ? (
          <div className={styles.catalogueGrid}>
            {filteredProducts.map((p) => (
              <div key={p.id} className={styles.catalogueCard}>
                <div className={styles.catalogueImgBox}>
                  {p.isCloseout && (
                    <span className={styles.catalogueDealBadge}>
                      {p.closeoutBadge || 'Closeout Deal'}
                    </span>
                  )}
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>

                <div className={styles.catalogueCardBody}>
                  <div className={styles.catalogueBrandLine}>
                    <span className={styles.catalogueBrand}>{p.brand}</span>
                    <span className={styles.catalogueModel}>#{p.modelNumber}</span>
                  </div>

                  <h4 className={styles.catalogueTitle} title={p.name}>
                    {p.name}
                  </h4>

                  <span className={styles.catalogueDeptTag}>
                    {DEPARTMENT_NAMES[p.category] || p.category}
                  </span>

                  <div className={styles.cataloguePriceBox}>
                    <div>
                      <span className={styles.catalogueCurrentPrice}>
                        ${p.price.toLocaleString()}
                      </span>
                      {p.originalPrice > p.price && (
                        <span className={styles.catalogueOriginalPrice}>
                          ${p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {p.originalPrice > p.price && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>
                        Save ${p.originalPrice - p.price}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.catalogueCardFooter}>
                  {p.inStock ? (
                    <span className={styles.catalogueStockBadge}>
                      <CheckCircle size={14} /> In Stock
                    </span>
                  ) : (
                    <span style={{ color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700 }}>
                      <XCircle size={14} /> Out of Stock
                    </span>
                  )}

                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <a
                      href={`/product/${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.35rem 0.55rem',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '6px',
                        color: '#64748b',
                        background: 'white',
                      }}
                      title="View public product page"
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button
                      onClick={() => openEditModal(p)}
                      className="btn-outline"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                      title="Edit product"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        color: '#ef4444',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        background: '#fef2f2',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                      }}
                      title="Delete product"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Appliance</th>
                  <th>Brand & Model</th>
                  <th>Department</th>
                  <th>Price / Slashed</th>
                  <th>Closeout Deal?</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '48px', height: '48px', position: 'relative', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
                          <Image src={p.image} alt={p.name} fill style={{ objectFit: 'contain', padding: '2px' }} />
                        </div>
                        <div style={{ maxWidth: '280px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{p.brand}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>#{p.modelNumber}</div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.78rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', textTransform: 'capitalize', fontWeight: 600 }}>
                        {p.category.replace('-', ' ')}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>${p.price.toLocaleString()}</div>
                      {p.originalPrice > p.price && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          ${p.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>

                    <td>
                      {p.isCloseout ? (
                        <span className="badge badge-red" style={{ fontSize: '0.68rem' }}>
                          <Tag size={10} style={{ marginRight: '3px' }} />
                          {p.closeoutBadge || 'Closeout'}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Standard</span>
                      )}
                    </td>

                    <td>
                      {p.inStock ? (
                        <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600 }}>
                          <CheckCircle size={14} /> In Stock
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600 }}>
                          <XCircle size={14} /> Out of Stock
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openEditModal(p)}
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                          title="Edit product"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ padding: '0.35rem 0.65rem', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', background: '#fef2f2', cursor: 'pointer', fontSize: '0.78rem' }}
                          title="Delete product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                {editingProduct ? 'Edit Product Details' : 'Add New Appliance to Inventory'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer', color: '#6b7280' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Model Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.modelNumber || ''}
                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Department Category *
                  </label>
                  <CustomDropdown
                    fullWidth
                    options={MODAL_CATEGORY_OPTIONS}
                    value={formData.category || 'washers-dryers'}
                    onChange={(val) => setFormData({ ...formData, category: val as Product['category'] })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Subcategory Title
                  </label>
                  <input
                    type="text"
                    value={formData.subCategory || ''}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Original / List Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>

                {/* Visual Pictures & Gallery Sequence Manager */}
                <div className={styles.imageManagerSection}>
                  <div className={styles.imageManagerHeader}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                        Product Pictures & Gallery ({imageList.length} {imageList.length === 1 ? 'image' : 'images'})
                      </label>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        First image is the <strong>⭐ Main Cover</strong>. Use arrows to change sequence. Supports PNG, JPG, WEBP, SVG, GIF, AVIF, or local files.
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="file"
                        id="productImageUploadInput"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                      <label
                        htmlFor="productImageUploadInput"
                        className="btn-outline"
                        style={{ padding: '0.42rem 0.85rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        title="Upload PNG, JPG, SVG, WEBP, GIF, AVIF files from your device"
                      >
                        <Upload size={14} />
                        <span>Upload Images</span>
                      </label>
                    </div>
                  </div>

                  {/* Add by URL input */}
                  <div className={styles.imageUploadBar}>
                    <input
                      type="url"
                      placeholder="Or paste any image URL (https://... or svg)..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUrlImage();
                        }
                      }}
                      style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem', outline: 'none', background: 'white' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="btn-primary"
                      style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={14} /> Add Picture
                    </button>
                  </div>

                  {/* Pictures Sequence Cards Grid */}
                  {imageList.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', background: 'white', borderRadius: '6px', border: '1px dashed #cbd5e1', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                      No pictures added yet. Upload files from your computer or paste an image URL above.
                    </div>
                  ) : (
                    <div className={styles.imageGrid}>
                      {imageList.map((imgUrl, index) => {
                        const isCover = index === 0;
                        return (
                          <div
                            key={index}
                            className={`${styles.imageCard} ${isCover ? styles.imageCardCover : ''}`}
                          >
                            <div className={styles.imagePreview}>
                              <span className={styles.imageSeqBadge}>#{index + 1}</span>
                              {isCover && <span className={styles.imageCoverBadge}>⭐ Cover</span>}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgUrl} alt={`Product photo ${index + 1}`} />
                            </div>

                            <div className={styles.imageCardActions}>
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveImage(index, index - 1)}
                                className={styles.imageArrowBtn}
                                title="Move Left / Earlier in sequence"
                              >
                                <ArrowLeft size={13} />
                              </button>

                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsCover(index)}
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: '#2563eb',
                                    background: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '4px',
                                    padding: '2px 5px',
                                    cursor: 'pointer',
                                  }}
                                  title="Make this the main cover photo"
                                >
                                  Cover
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={index === imageList.length - 1}
                                onClick={() => handleMoveImage(index, index + 1)}
                                className={styles.imageArrowBtn}
                                title="Move Right / Later in sequence"
                              >
                                <ArrowRight size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className={styles.imageDeleteBtn}
                                title="Remove this picture"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="isCloseout"
                    checked={formData.isCloseout || false}
                    onChange={(e) => setFormData({ ...formData, isCloseout: e.target.checked })}
                    style={{ accentColor: 'var(--accent-red)', width: '18px', height: '18px' }}
                  />
                  <label htmlFor="isCloseout" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                    🔥 Mark as Closeout Deal (Featured Clearance)
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock !== false}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    style={{ accentColor: 'var(--primary-navy)', width: '18px', height: '18px' }}
                  />
                  <label htmlFor="inStock" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    In Stock & Ready for Delivery
                  </label>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-outline"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  {editingProduct ? 'Update Product' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
