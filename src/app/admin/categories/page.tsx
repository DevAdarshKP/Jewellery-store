'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, Upload, X, Check, AlertCircle } from 'lucide-react';
import { ICategory } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormImageUrl('');
    setFormDisplayOrder(categories.length + 1);
    setFormIsActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ICategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || '');
    setFormImageUrl(cat.imageUrl || '');
    setFormDisplayOrder(cat.displayOrder ?? 0);
    setFormIsActive(cat.isActive ?? true);
    setError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      // Auto-generate slug from name
      const slugVal = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormSlug(slugVal);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFormImageUrl(data.media.url);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: formName,
      slug: formSlug,
      description: formDescription,
      imageUrl: formImageUrl,
      displayOrder: Number(formDisplayOrder),
      isActive: formIsActive,
    };

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to delete category');
        return;
      }
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-onyx-900">Category Management</h1>
          <p className="text-sm text-onyx-500 mt-1">
            Define jewellery collections, order hierarchy, and storefront navigation groups.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-ivory-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-onyx-400 text-sm">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-onyx-400 text-sm">
            No categories defined yet. Click &quot;Add New Category&quot; to create your first collection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory-100/60 text-[11px] uppercase tracking-wider text-onyx-500 border-b border-ivory-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Category Details</th>
                  <th className="px-6 py-3 font-semibold">URL Slug</th>
                  <th className="px-6 py-3 font-semibold">Assigned Products</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-ivory-50/60 transition">
                    <td className="px-6 py-4 font-mono text-xs text-onyx-500">#{cat.displayOrder}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-ivory-200 overflow-hidden shrink-0 border border-ivory-300 flex items-center justify-center">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <FolderTree className="w-5 h-5 text-onyx-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-serif font-medium text-onyx-900 text-base">{cat.name}</div>
                          {cat.description && (
                            <div className="text-xs text-onyx-500 line-clamp-1 max-w-sm">{cat.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-onyx-600">/{cat.slug}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-onyx-700">
                      {cat.productCount ?? 0} item(s)
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-onyx-100 text-onyx-600 border border-onyx-200'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-onyx-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-onyx-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-onyx-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-ivory-200 shadow-luxury overflow-hidden">
            <div className="px-6 py-4 border-b border-ivory-200 flex items-center justify-between bg-ivory-50">
              <h2 className="font-serif text-lg font-semibold text-onyx-900">
                {editingCategory ? 'Edit Collection Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-onyx-400 hover:text-onyx-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Royal Necklaces & Pendants"
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. royal-necklaces"
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm font-mono text-onyx-800 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief luxury summary for this collection..."
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Collection Cover Photo
                </label>
                <div className="flex items-center space-x-3">
                  {formImageUrl && (
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-ivory-300 shrink-0"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center space-x-2 px-3 py-2 border border-dashed border-ivory-300 hover:border-gold-500 bg-ivory-50/40 rounded-lg text-xs text-onyx-600 transition">
                      <Upload className="w-4 h-4 text-gold-600" />
                      <span>{uploadingImage ? 'Uploading image...' : 'Upload Cover Photo'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="Or paste image URL directly..."
                  className="w-full mt-2 px-3 py-1.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs font-mono text-onyx-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                    Display Sequence
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-gold-600 rounded border-ivory-300 focus:ring-gold-500"
                  />
                  <label htmlFor="isActive" className="text-xs font-medium text-onyx-700 cursor-pointer">
                    Active on Storefront
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-ivory-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-ivory-300 text-onyx-600 hover:bg-ivory-100 rounded-lg text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

