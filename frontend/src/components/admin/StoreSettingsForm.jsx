import React, { useState, useEffect } from 'react';
import { Save, Loader2, Store, Phone } from 'lucide-react';
import { updateStoreSettings } from '../../api/settings';

export default function StoreSettingsForm({
  storeSettings,
  onRefresh,
  showToast,
}) {
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (storeSettings) {
      setStoreName(storeSettings.store_name || '');
      setTagline(storeSettings.tagline || '');
      setPhone(storeSettings.contact_phone || '');
      setWhatsapp(storeSettings.whatsapp_number || '');
      setAddress(storeSettings.address || '');
      setGoogleMapsUrl(storeSettings.google_maps_url || '');
      setHours(storeSettings.opening_hours || '');
      setDescription(storeSettings.description || '');
      setCurrencySymbol(storeSettings.currency_symbol || '₹');
    }
  }, [storeSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) {
      showToast({ type: 'error', title: 'दुकान का नाम भरें', message: 'दुकान का नाम खाली नहीं हो सकता।' });
      return;
    }

    try {
      setSaving(true);
      await updateStoreSettings({
        store_name: storeName.trim(),
        tagline: tagline.trim() || null,
        contact_phone: phone.trim() || null,
        whatsapp_number: whatsapp.trim() || null,
        address: address.trim() || null,
        google_maps_url: googleMapsUrl.trim() || null,
        opening_hours: hours.trim() || null,
        description: description.trim() || null,
        currency_symbol: currencySymbol.trim() || '₹',
      });
      showToast({ type: 'success', title: 'जानकारी सुरक्षित हुई', message: 'दुकान का फोन नंबर, पता और समय सफलतापूर्वक अपडेट हो गया है।' });
      onRefresh();
    } catch (err) {
      showToast({ type: 'error', title: 'त्रुटि', message: err.message || 'दुकान की जानकारी सुरक्षित नहीं हो सकी।' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl bg-[#0A0A0C] text-[#F5F0E7]">
      <div className="pb-4 border-b border-[#302E31]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0E7]">
          दुकान की जानकारी और संपर्क <span className="text-xs font-normal text-[#817C77]">(Store Settings)</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#B0AAA1] mt-1">
          यहाँ से अपनी दुकान का नाम, फोन नंबर, व्हाट्सएप नंबर, दुकान का पता और खुलने का समय बदलें।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#17171C] rounded-2xl border border-[#302E31] p-6 sm:p-8 space-y-6">
        {/* Branding */}
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-[#D2AC68] uppercase tracking-wider pb-2 border-b border-[#302E31] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#D2AC68]" />
            <span>1. दुकान की पहचान (Store Identity)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                दुकान का नाम <span className="text-[#F08A83]">*</span>
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                placeholder="उदा: राजू किराना स्टोर"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                दुकान का नारा / स्लोगन (Tagline)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="उदा: शुद्ध राशन, सही तौल, पक्के भाव"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                दुकान के बारे में परिचय (About Store)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="उदा: पिछले 35 वर्षों से आपके मोहल्ले की अपनी पुरानी और भरोसेमंद राशन दुकान। दाल, आटा, तेल, मसाले सब शुद्ध और छाने हुए।"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-[#D2AC68] uppercase tracking-wider pb-2 border-b border-[#302E31] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#D2AC68]" />
            <span>2. फोन नंबर, व्हाट्सएप और दुकान का समय</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                कॉल करने का फोन नंबर (Phone)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="उदा: +91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none tabular-nums font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block flex items-center justify-between">
                <span>व्हाट्सएप नंबर (WhatsApp)</span>
                <span className="text-xs text-[#70C69A] font-normal">इस पर ग्राहक पर्ची भेजेंगे</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="उदा: 919876543210 (देश कोड 91 के साथ)"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-mono"
              />
              <p className="text-[11px] text-[#817C77]">
                ग्राहक वेबसाइट से सीधे इस नंबर पर राशन लिस्ट और ऑर्डर भेज सकेंगे।
              </p>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                दुकान का पूरा पता (Shop Address)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="उदा: दुकान नंबर 4, मुख्य बाजार, शिव मंदिर के पास"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block flex items-center justify-between">
                <span>गूगल मैप लोकेशन लिंक (Google Maps Link)</span>
                <span className="text-xs text-[#D2AC68] font-normal">ग्राहक सीधे मैप पर दुकान खोज सकेंगे</span>
              </label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="उदा: https://maps.app.goo.gl/..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-mono"
              />
              <p className="text-[11px] text-[#817C77]">
                Google Maps से अपनी दुकान का रास्ता/लोकेशन लिंक यहाँ डालें (उदा: https://maps.app.goo.gl/3tPyDrjZFJjavukX8)
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                दुकान खुलने और बंद होने का समय
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="उदा: सातों दिन: सुबह 7:00 बजे से रात 10:00 बजे तक"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-[#B0AAA1] block">
                मुद्रा चिन्ह (Currency)
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                placeholder="₹"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#101014] text-[#D2AC68] placeholder-[#817C77] rounded-lg border border-[#302E31] focus:border-[#D2AC68] outline-none font-bold"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#302E31] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 btn-gold-primary disabled:opacity-50 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>दुकान की जानकारी सुरक्षित करें (Save)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
