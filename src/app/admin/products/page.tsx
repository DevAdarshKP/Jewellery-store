'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { ICategory, IProduct } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      });
      if (search.trim()) params.set('search', search.trim());
      if (selectedCategory !== 'all') params.set('categoryId', selectedCategory);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.items);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const toggleFeatured = async (product: IProduct) => {
    try {
      const nextFeatured = !product.isFeatured;
      const res = await fetch(`/api/admin/products/${product.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: nextFeatured }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === product.id ? { ...p, isFeatured: nextFeatured } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const toggleStatus = async (product: IProduct) => {
    try {
      const nextStatus = product.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const res = await fetch(`/api/admin/products/${product.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (product: IProduct) => {
    if (!confirm(`Are you sure you want to permanently delete "${product.title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-onyx-900">Jewellery Catalogue</h1>
          <p className="text-sm text-onyx-500 mt-1">
            Manage your fine jewellery pieces, publication states, and homepage showcases ({totalCount} total items).
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold rounded-lg shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-ivory-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, metal or gemstones..."
            className="w-full pl-9 pr-4 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs text-onyx-900 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-onyx-400 absolute left-3 top-2.5 pointer-events-none" />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-onyx-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs font-medium text-onyx-800"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-onyx-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs font-medium text-onyx-800"
            >
              <option value="all">All States</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-ivory-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-onyx-400 text-sm">Loading jewellery items...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-gold-500 mx-auto" />
            <div className="font-serif text-lg font-semibold text-onyx-900">No items found</div>
            <p className="text-xs text-onyx-500 max-w-sm mx-auto">
              No products match your current search or filter criteria. Try clearing filters or adding a new piece.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory-100/60 text-[11px] uppercase tracking-wider text-onyx-500 border-b border-ivory-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Jewellery Item</th>
                  <th className="px-6 py-3 font-semibold">SKU Code</th>
                  <th className="px-6 py-3 font-semibold">Collection</th>
                  <th className="px-6 py-3 font-semibold">Price / Guidance</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-center">Featured</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {products.map((product) => {
                  const primaryImg = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;
                  return (
                    <tr key={product.id} className="hover:bg-ivory-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-ivory-200 overflow-hidden shrink-0 border border-ivory-300 flex items-center justify-center">
                            {primaryImg ? (
                              <img src={primaryImg} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <Sparkles className="w-5 h-5 text-onyx-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-serif font-medium text-onyx-900 text-sm">{product.title}</div>
                            <div className="text-[11px] text-onyx-500 line-clamp-1 max-w-xs">{product.summary}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-onyx-700 font-semibold">{product.sku}</td>
                      <td className="px-6 py-4 text-xs text-onyx-600">{product.categoryName}</td>
                      <td className="px-6 py-4 text-xs font-serif text-onyx-800">
                        {product.priceGuidance || 'Price on Request'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => toggleStatus(product)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition ${
                            product.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {product.status === 'PUBLISHED' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{product.status}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFeatured(product)}
                          className={`p-1.5 rounded-full transition ${
                            product.isFeatured
                              ? 'text-gold-600 bg-gold-50 hover:bg-gold-100'
                              : 'text-onyx-300 hover:text-gold-500 hover:bg-ivory-100'
                          }`}
                          title="Toggle featured showcase status"
                        >
                          <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-gold-500 text-gold-500' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="inline-block p-1.5 text-onyx-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="p-1.5 text-onyx-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-ivory-200 flex items-center justify-between text-xs text-onyx-600">
            <div>
              Page {page} of {totalPages} ({totalCount} items)
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-ivory-300 rounded-lg hover:bg-ivory-100 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-ivory-300 rounded-lg hover:bg-ivory-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

