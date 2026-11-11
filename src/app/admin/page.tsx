'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, FolderTree, Eye, Plus, MessageCircle, ArrowUpRight, Clock } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalCategories: number;
  featuredProducts: number;
}

interface RecentProduct {
  id: string;
  title: string;
  sku: string;
  categoryName: string;
  status: string;
  isFeatured: boolean;
  image: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentProducts(data.recentProducts || []);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-onyx-900">Catalogue Dashboard</h1>
          <p className="text-sm text-onyx-500 mt-1">
            Overview of your fine jewellery catalogue, active categories, and curated showcases.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/categories"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-ivory-300 hover:border-gold-400 text-onyx-800 text-xs font-medium rounded-lg shadow-sm transition"
          >
            <FolderTree className="w-3.5 h-3.5 text-gold-600" />
            <span>Manage Categories</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-xs font-medium rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-ivory-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-onyx-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Total Products</span>
            <Sparkles className="w-4 h-4 text-gold-600" />
          </div>
          <div className="font-serif text-3xl font-semibold text-onyx-900">
            {loading ? '—' : stats?.totalProducts ?? 0}
          </div>
          <div className="text-[11px] text-onyx-400 mt-2">All inventory records</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-ivory-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-onyx-500">Published</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-3xl font-semibold text-emerald-700">
            {loading ? '—' : stats?.publishedProducts ?? 0}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-2">Live on public storefront</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-ivory-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-onyx-500">Drafts</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-3xl font-semibold text-amber-700">
            {loading ? '—' : stats?.draftProducts ?? 0}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-2">Pending publication</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-ivory-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-onyx-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Categories</span>
            <FolderTree className="w-4 h-4 text-gold-600" />
          </div>
          <div className="font-serif text-3xl font-semibold text-onyx-900">
            {loading ? '—' : stats?.totalCategories ?? 0}
          </div>
          <div className="text-[11px] text-onyx-400 mt-2">Taxonomy collections</div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-5 rounded-xl border border-ivory-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gold-600 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-onyx-500">Featured</span>
            <Sparkles className="w-4 h-4 text-gold-600 fill-gold-600" />
          </div>
          <div className="font-serif text-3xl font-semibold text-gold-700">
            {loading ? '—' : stats?.featuredProducts ?? 0}
          </div>
          <div className="text-[11px] text-gold-600/80 mt-2">Homepage curated showcase</div>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products/new"
          className="group p-6 bg-gradient-to-br from-white to-gold-50/50 rounded-2xl border border-ivory-200 hover:border-gold-300 shadow-sm hover:shadow-luxury transition flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold-600">Action</div>
            <div className="font-serif text-lg font-semibold text-onyx-900 group-hover:text-gold-700 transition">
              Create New Jewellery Item
            </div>
            <div className="text-xs text-onyx-500">Upload photos, configure Karat specs and publish</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-100 group-hover:bg-gold-500 text-gold-700 group-hover:text-white flex items-center justify-center transition">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="group p-6 bg-gradient-to-br from-white to-ivory-100/50 rounded-2xl border border-ivory-200 hover:border-gold-300 shadow-sm hover:shadow-luxury transition flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-onyx-500">Taxonomy</div>
            <div className="font-serif text-lg font-semibold text-onyx-900 group-hover:text-gold-700 transition">
              Organize Collections
            </div>
            <div className="text-xs text-onyx-500">Sort and manage rings, necklaces, and bangles</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-ivory-200 group-hover:bg-gold-500 text-onyx-700 group-hover:text-white flex items-center justify-center transition">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="group p-6 bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl border border-ivory-200 hover:border-emerald-300 shadow-sm hover:shadow-luxury transition flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Enquiry Setup</div>
            <div className="font-serif text-lg font-semibold text-onyx-900 group-hover:text-emerald-700 transition">
              Configure WhatsApp
            </div>
            <div className="text-xs text-onyx-500">Set concierge number and enquiry message templates</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition">
            <MessageCircle className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Recent Catalogue Items */}
      <div className="bg-white rounded-2xl border border-ivory-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-ivory-200 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold text-onyx-900">Recently Added Products</h2>
            <p className="text-xs text-onyx-500 mt-0.5">Quick status inspection and editing</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-medium text-gold-600 hover:text-gold-700 flex items-center space-x-1"
          >
            <span>View All Products</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="p-12 text-center text-onyx-400 text-sm">
            {loading ? 'Loading catalog items...' : 'No products found. Click "Add New Product" to start.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory-100/60 text-[11px] uppercase tracking-wider text-onyx-500 border-b border-ivory-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">SKU Code</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Showcase</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-ivory-50/60 transition">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-ivory-200 overflow-hidden shrink-0 border border-ivory-300 flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-onyx-400" />
                        )}
                      </div>
                      <span className="font-medium text-onyx-900">{product.title}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-onyx-600">{product.sku}</td>
                    <td className="px-6 py-4 text-xs text-onyx-600">{product.categoryName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          product.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isFeatured ? (
                        <span className="inline-flex items-center space-x-1 text-gold-600 text-xs font-medium">
                          <Sparkles className="w-3.5 h-3.5 fill-gold-600" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-xs text-onyx-400">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-gold-600 hover:text-gold-700 font-medium hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

