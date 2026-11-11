'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  Star,
  Check,
  ArrowLeft,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { ICategory, IProductImage, IProductAttribute } from '@/types';

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Core Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [metal, setMetal] = useState(initialData?.metal || '22K Yellow Gold');
  const [purity, setPurity] = useState(initialData?.purity || '91.6% Pure Gold');
  const [stones, setStones] = useState(initialData?.stones || 'Natural Diamonds & Precious Gemstones');
  const [priceGuidance, setPriceGuidance] = useState(initialData?.priceGuidance || '');
  const [quoteOnly, setQuoteOnly] = useState(initialData?.quoteOnly ?? true);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>(initialData?.status || 'PUBLISHED');
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);

  // Gallery Images
  const [images, setImages] = useState<IProductImage[]>(initialData?.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');

  // Dynamic Specification Attributes
  const [attributes, setAttributes] = useState<IProductAttribute[]>(
    initialData?.attributes || [
      { group: 'Gold & Metal', key: 'Metal Purity', value: '22 Karat (916 BIS Hallmarked)' },
      { group: 'Gemstones', key: 'Diamond Quality', value: 'VVS-VS Clarity, F-G Color' },
      { group: 'Craftsmanship', key: 'Making Technique', value: 'Handcrafted Heritage Jadau' },
    ]
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (!categoryId && data.length > 0) {
            setCategoryId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, [categoryId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
      if (!sku) {
        const initials = val
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 3);
        const rand = Math.floor(100 + Math.random() * 900);
        setSku(`LUM-${initials || 'JW'}-${rand}`);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      setError(null);

      const uploadedList: IProductImage[] = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/uploads', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        const isFirst = uploadedList.length === 0 && i === 0;
        uploadedList.push({
          url: data.media.url,
          alt: `${title || 'Jewellery'} photo ${uploadedList.length + 1}`,
          isPrimary: isFirst,
          displayOrder: uploadedList.length + 1,
        });
      }

      setImages(uploadedList);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const addManualImageUrl = () => {
    if (!manualImageUrl.trim()) return;
    const isFirst = images.length === 0;
    setImages([
      ...images,
      {
        url: manualImageUrl.trim(),
        alt: `${title || 'Jewellery'} photo`,
        isPrimary: isFirst,
        displayOrder: images.length + 1,
      },
    ]);
    setManualImageUrl('');
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const setPrimaryImage = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(updated);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { group: 'Specifications', key: '', value: '' }]);
  };

  const updateAttribute = (index: number, field: keyof IProductAttribute, val: string) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError('Please upload at least one product photo for the gallery.');
      return;
    }

    if (!categoryId) {
      setError('Please select a category for this product.');
      return;
    }

    setSaving(true);

    const payload = {
      title,
      slug,
      sku: sku.toUpperCase(),
      categoryId,
      summary,
      description,
      metal,
      purity,
      stones,
      priceGuidance,
      quoteOnly,
      status,
      isFeatured,
      images,
      attributes: attributes.filter((a) => a.key.trim() && a.value.trim()),
    };

    try {
      const url = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-2 border border-ivory-300 hover:border-gold-400 bg-white rounded-lg text-onyx-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-onyx-900">
              {isEdit ? `Edit: ${initialData.title}` : 'Add New Jewellery Item'}
            </h1>
            <p className="text-xs text-onyx-500 mt-0.5">
              Enter product details, luxury specifications, and multi-image photo gallery.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-ivory-300 text-onyx-600 hover:bg-ivory-100 rounded-lg text-xs font-medium transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEdit ? 'Update Product' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <div className="font-semibold">Unable to save product</div>
            <div className="mt-0.5">{error}</div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Basic Info & Gallery */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Primary Identity */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-semibold text-onyx-900 border-b border-ivory-100 pb-3">
              Product Identity & Story
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Royal Kundan & Polki Diamond Choker"
                className="w-full px-3.5 py-2.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. royal-kundan-polki-choker"
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm font-mono text-onyx-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  SKU / Product Code *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="e.g. LUM-NK-001"
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm font-mono font-semibold text-onyx-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Luxury Teaser Summary *
              </label>
              <textarea
                rows={2}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A one or two sentence luxury teaser highlighting the distinctive heritage allure..."
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Detailed Craftsmanship Narrative *
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Elaborate on the artisanal carving, uncut stone setting, history of the ornament, and styling recommendations..."
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
              />
            </div>
          </div>

          {/* Card: Photo Gallery */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-100 pb-3">
              <div>
                <h2 className="font-serif text-lg font-semibold text-onyx-900">Product Image Gallery</h2>
                <p className="text-xs text-onyx-500">
                  Upload multiple high-resolution photos. Choose a primary thumbnail for catalogue listings.
                </p>
              </div>
              <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200">
                {images.length} Image(s)
              </span>
            </div>

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-ivory-300 hover:border-gold-500 bg-ivory-50/40 rounded-xl p-6 text-center transition">
              <Upload className="w-8 h-8 text-gold-600 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-sm font-semibold text-gold-600 hover:text-gold-700 underline">
                  Choose photos from device
                </span>
                <span className="text-xs text-onyx-500 block mt-1">
                  Supports JPEG, PNG, WebP up to 5MB each. Multiple files supported.
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {uploadingImage && (
                <div className="text-xs font-semibold text-gold-600 mt-2 animate-pulse">
                  Uploading files to local storage adapter...
                </div>
              )}
            </div>

            {/* Manual URL input fallback */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                placeholder="Or paste external image URL / demonstration asset..."
                className="flex-1 px-3 py-1.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs font-mono text-onyx-800"
              />
              <button
                type="button"
                onClick={addManualImageUrl}
                className="px-3 py-1.5 bg-ivory-200 hover:bg-gold-500 hover:text-white rounded-lg text-xs font-medium text-onyx-700 transition"
              >
                Add URL
              </button>
            </div>

            {/* Gallery Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 bg-ivory-100 group ${
                      img.isPrimary ? 'border-gold-500 ring-2 ring-gold-400/20' : 'border-ivory-200'
                    }`}
                  >
                    <img src={img.url} alt={img.alt || 'Product'} className="w-full h-32 object-cover" />

                    <div className="absolute inset-0 bg-onyx-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(idx)}
                          className="p-1.5 bg-white text-gold-600 rounded-full hover:bg-gold-50 shadow"
                          title="Set as Primary Thumbnail"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-50 shadow"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {img.isPrimary && (
                      <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: Dynamic Specifications Builder */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-100 pb-3">
              <div>
                <h2 className="font-serif text-lg font-semibold text-onyx-900">Technical Specifications</h2>
                <p className="text-xs text-onyx-500">
                  Custom key-value attributes rendered in the product detail specification table.
                </p>
              </div>
              <button
                type="button"
                onClick={addAttribute}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-gold-600 hover:text-gold-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Attribute</span>
              </button>
            </div>

            <div className="space-y-3">
              {attributes.map((attr, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={attr.group}
                    onChange={(e) => updateAttribute(idx, 'group', e.target.value)}
                    placeholder="Group (e.g. Metal)"
                    className="w-1/3 px-3 py-1.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs text-onyx-800"
                  />
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => updateAttribute(idx, 'key', e.target.value)}
                    placeholder="Key (e.g. Weight)"
                    className="w-1/3 px-3 py-1.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs text-onyx-800"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttribute(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. 48.5 grams)"
                    className="flex-1 px-3 py-1.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs text-onyx-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttribute(idx)}
                    className="p-1.5 text-onyx-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Settings, Category, Status */}
        <div className="space-y-6">
          {/* Publishing & Visibility */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-semibold text-onyx-900 border-b border-ivory-100 pb-2">
              Status & Visibility
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1.5">
                Publication State
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900 font-medium"
              >
                <option value="PUBLISHED">Published (Visible on Storefront)</option>
                <option value="DRAFT">Draft (Back-Office Only)</option>
                <option value="ARCHIVED">Archived (Hidden)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-ivory-100">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-gold-600 rounded border-ivory-300 focus:ring-gold-500"
                />
                <div>
                  <span className="text-xs font-semibold text-onyx-900 block">Feature in Homepage Showcase</span>
                  <span className="text-[11px] text-onyx-500 block leading-tight mt-0.5">
                    Highlights this piece in the curated luxury carousel on the home page.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Collection Category */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-semibold text-onyx-900 border-b border-ivory-100 pb-2">
              Collection Category *
            </h3>

            <div>
              {loadingCategories ? (
                <div className="text-xs text-onyx-400">Loading collections...</div>
              ) : (
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900 font-medium"
                >
                  <option value="">Select a Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Metal & Price Guidance */}
          <div className="bg-white p-6 rounded-2xl border border-ivory-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-semibold text-onyx-900 border-b border-ivory-100 pb-2">
              Material & Quotation
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Primary Metal
              </label>
              <input
                type="text"
                value={metal}
                onChange={(e) => setMetal(e.target.value)}
                placeholder="e.g. 22K Yellow Gold"
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs text-onyx-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Purity Certification
              </label>
              <input
                type="text"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                placeholder="e.g. 91.6% (22K BIS Hallmarked)"
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs text-onyx-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Gemstones & Inlays
              </label>
              <input
                type="text"
                value={stones}
                onChange={(e) => setStones(e.target.value)}
                placeholder="e.g. Uncut Polki, Russian Emeralds"
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs text-onyx-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Price Guidance / Estimate
              </label>
              <input
                type="text"
                value={priceGuidance}
                onChange={(e) => setPriceGuidance(e.target.value)}
                placeholder="e.g. From $3,200 (or leave empty)"
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-xs text-onyx-900"
              />
              <span className="text-[11px] text-onyx-400 block mt-1">
                Leave empty or specify &quot;Price on Request&quot; for bespoke items.
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

