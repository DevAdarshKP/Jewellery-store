'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Layout, Building2, Check, AlertCircle, Save } from 'lucide-react';
import { generateWhatsAppEnquiryLink } from '@/lib/whatsapp/link-generator';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'homepage' | 'general'>('whatsapp');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WhatsApp Settings
  const [waPhone, setWaPhone] = useState('918129440790');
  const [waTemplate, setWaTemplate] = useState(
    'Hello Lumière Atelier, I would like to enquire about "{productName}" (Code: {productSku}). Link: {productUrl}'
  );
  const [waEnabled, setWaEnabled] = useState(true);

  // Homepage Settings
  const [heroBadge, setHeroBadge] = useState('Haute Joaillerie & Ornaments');
  const [heroTitle, setHeroTitle] = useState('Timeless Elegance, Crafted for Generations');
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Discover exquisite bespoke jewellery designed to celebrate life's most precious milestones."
  );
  const [heroCtaText, setHeroCtaText] = useState('Explore Collections');
  const [announcementText, setAnnouncementText] = useState(
    'Complimentary Private Appointments & Worldwide Bespoke Consultations Available'
  );
  const [aboutHeading, setAboutHeading] = useState('The Heritage of Lumière Atelier');
  const [aboutText, setAboutText] = useState(
    'Rooted in centuries-old artisanal traditions, Lumière Atelier crafts timeless high-jewellery masterpieces. Every gemstone is hand-selected for extraordinary fire, every gold setting forged with peerless precision, creating heirloom ornaments that honor grace, dignity, and personal legacy.'
  );

  // General Settings
  const [brandName, setBrandName] = useState('Lumière Atelier');
  const [tagline, setTagline] = useState('Fine Jewellery & Ornaments');
  const [contactEmail, setContactEmail] = useState('concierge@lumiereatelier.local');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [showroomAddress, setShowroomAddress] = useState('14 Heritage Boulevard, Luxury Quarter');
  const [businessHours, setBusinessHours] = useState('Monday – Saturday: 10:30 AM – 8:00 PM');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.whatsapp) {
            setWaPhone(data.whatsapp.phoneNumber || '');
            setWaTemplate(data.whatsapp.messageTemplate || '');
            setWaEnabled(data.whatsapp.enabled ?? true);
          }
          if (data.homepage) {
            setHeroBadge(data.homepage.heroBadge || '');
            setHeroTitle(data.homepage.heroTitle || '');
            setHeroSubtitle(data.homepage.heroSubtitle || '');
            setHeroCtaText(data.homepage.heroCtaText || '');
            setAnnouncementText(data.homepage.announcementText || '');
            setAboutHeading(data.homepage.aboutStoryHeading || '');
            setAboutText(data.homepage.aboutStoryText || '');
          }
          if (data.general) {
            setBrandName(data.general.brandName || '');
            setTagline(data.general.tagline || '');
            setContactEmail(data.general.contactEmail || '');
            setContactPhone(data.general.contactPhone || '');
            setShowroomAddress(data.general.showroomAddress || '');
            setBusinessHours(data.general.businessHours || '');
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (section: 'whatsapp' | 'homepage' | 'general') => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    let payload: any = {};
    if (section === 'whatsapp') {
      payload = {
        phoneNumber: waPhone,
        messageTemplate: waTemplate,
        enabled: waEnabled,
      };
    } else if (section === 'homepage') {
      payload = {
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroCtaText,
        announcementText,
        aboutStoryHeading: aboutHeading,
        aboutStoryText: aboutText,
      };
    } else if (section === 'general') {
      payload = {
        brandName,
        tagline,
        contactEmail,
        contactPhone,
        showroomAddress,
        businessHours,
      };
    }

    try {
      const res = await fetch(`/api/admin/settings/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to save configuration');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  // Live WhatsApp preview calculation
  const sampleWhatsAppUrl = generateWhatsAppEnquiryLink({
    phoneNumber: waPhone,
    productName: 'Royal Kundan Choker',
    productSku: 'LUM-NK-001',
    productUrl: 'http://localhost:3000/products/royal-kundan-choker',
    template: waTemplate,
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-onyx-900">Website & WhatsApp Settings</h1>
          <p className="text-sm text-onyx-500 mt-1">
            Configure direct concierge enquiry channels, homepage editorial content, and store metadata.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-ivory-200">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'whatsapp'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
              : 'border-transparent text-onyx-500 hover:text-onyx-900'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Concierge</span>
        </button>

        <button
          onClick={() => setActiveTab('homepage')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'homepage'
              ? 'border-gold-500 text-gold-700 bg-gold-50/40'
              : 'border-transparent text-onyx-500 hover:text-onyx-900'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Homepage CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'general'
              ? 'border-onyx-800 text-onyx-900 bg-ivory-100/60'
              : 'border-transparent text-onyx-500 hover:text-onyx-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>General Information</span>
        </button>
      </div>

      {/* Tab 1: WhatsApp Configuration */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white p-8 rounded-2xl border border-ivory-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-ivory-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-semibold text-onyx-900">Direct WhatsApp Enquiry Channel</h2>
              <p className="text-xs text-onyx-500 mt-0.5">
                When visitors click &quot;Enquire on WhatsApp&quot;, a pre-filled click-to-chat message opens.
              </p>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={waEnabled}
                onChange={(e) => setWaEnabled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-ivory-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-onyx-800">Enable Concierge Button</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                WhatsApp Phone Number (with Country Code, digits only) *
              </label>
              <input
                type="text"
                required
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder="e.g. 919876543210"
                className="w-full px-3.5 py-2.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm font-mono text-onyx-900"
              />
              <span className="text-[11px] text-onyx-500 block mt-1">
                Do not include +, spaces or hyphens. Example: 919876543210 for India, 14155552671 for USA.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Enquiry Message Template *
              </label>
              <textarea
                rows={3}
                required
                value={waTemplate}
                onChange={(e) => setWaTemplate(e.target.value)}
                placeholder="Hello, I would like to enquire about {productName}..."
                className="w-full px-3.5 py-2.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900 font-mono"
              />
              <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-onyx-600">
                <span className="font-semibold text-onyx-700">Available Placeholders:</span>
                <code className="bg-ivory-100 px-1.5 py-0.5 rounded border border-ivory-200">
                  {'{productName}'}
                </code>
                <code className="bg-ivory-100 px-1.5 py-0.5 rounded border border-ivory-200">
                  {'{productSku}'}
                </code>
                <code className="bg-ivory-100 px-1.5 py-0.5 rounded border border-ivory-200">
                  {'{productUrl}'}
                </code>
              </div>
            </div>

            {/* Live Message Simulator */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer WhatsApp Message Preview</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-200/80 text-xs text-onyx-800 font-sans leading-relaxed shadow-sm">
                {waTemplate
                  .replace('{productName}', 'Royal Kundan Choker')
                  .replace('{productSku}', 'LUM-NK-001')
                  .replace('{productUrl}', 'http://localhost:3000/products/royal-kundan-choker')}
              </div>
              <div className="text-[11px] text-emerald-700 truncate">
                Target URL: <span className="font-mono">{sampleWhatsAppUrl}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-200 flex justify-end">
            <button
              onClick={() => handleSave('whatsapp')}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save WhatsApp Configuration'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Homepage CMS */}
      {activeTab === 'homepage' && (
        <div className="bg-white p-8 rounded-2xl border border-ivory-200 shadow-sm space-y-6">
          <div className="border-b border-ivory-100 pb-4">
            <h2 className="font-serif text-lg font-semibold text-onyx-900">Homepage Content & Editorial Hero</h2>
            <p className="text-xs text-onyx-500 mt-0.5">
              Customize the prominent editorial banner, announcement bar, and craftsmanship story.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Complimentary Private Appointments & Worldwide Consultations Available"
                className="w-full px-3.5 py-2.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Hero Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  placeholder="e.g. Haute Joaillerie & Ornaments"
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Hero CTA Button Label
                </label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  placeholder="e.g. Explore Collections"
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Hero Headline (Large Editorial Serif) *
              </label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. Timeless Elegance, Crafted for Generations"
                className="w-full px-3.5 py-2.5 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm font-serif font-semibold text-onyx-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Hero Subtitle Narrative *
              </label>
              <textarea
                rows={2}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Descriptive luxury narrative displayed beneath the main hero headline..."
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
              />
            </div>

            <div className="pt-4 border-t border-ivory-100 space-y-3">
              <h3 className="font-serif text-base font-semibold text-onyx-900">
                Craftsmanship & Heritage Section
              </h3>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Story Heading
                </label>
                <input
                  type="text"
                  value={aboutHeading}
                  onChange={(e) => setAboutHeading(e.target.value)}
                  placeholder="e.g. The Heritage of Lumière Atelier"
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Story Narrative Text
                </label>
                <textarea
                  rows={4}
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Detailed craftsmanship narrative..."
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-200 flex justify-end">
            <button
              onClick={() => handleSave('homepage')}
              disabled={saving}
              className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Homepage Content'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: General Information */}
      {activeTab === 'general' && (
        <div className="bg-white p-8 rounded-2xl border border-ivory-200 shadow-sm space-y-6">
          <div className="border-b border-ivory-100 pb-4">
            <h2 className="font-serif text-lg font-semibold text-onyx-900">Brand & Contact Details</h2>
            <p className="text-xs text-onyx-500 mt-0.5">
              These details appear in the public footer, contact page, and browser metadata.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm font-serif font-semibold text-onyx-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Concierge Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                  Showroom Contact Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Atelier & Showroom Physical Address
              </label>
              <input
                type="text"
                value={showroomAddress}
                onChange={(e) => setShowroomAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-onyx-700 mb-1">
                Visiting & Salon Hours
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full px-3.5 py-2 bg-ivory-50/60 border border-ivory-300 rounded-lg text-sm text-onyx-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-200 flex justify-end">
            <button
              onClick={() => handleSave('general')}
              disabled={saving}
              className="px-6 py-2.5 bg-onyx-900 hover:bg-onyx-950 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save General Info'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

