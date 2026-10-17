import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadImage } from '../../api/settings';
import { getFullImageUrl } from '../../api/client';

export default function ImageUpload({
  imageUrl,
  onImageUploaded,
  value,
  onChange,
  showToast,
}) {
  const currentUrl = imageUrl !== undefined ? imageUrl : value;
  const updateUrl = onImageUploaded || onChange;

  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast({ type: 'error', title: 'फोटो बहुत बड़ी है', message: 'फोटो 5 MB से छोटी होनी चाहिए।' });
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      showToast({ type: 'error', title: 'गलत फॉर्मेट', message: 'कृपया केवल JPG, PNG या WEBP फोटो ही चुनें।' });
      return;
    }

    try {
      setUploading(true);
      const res = await uploadImage(file);
      if (updateUrl) updateUrl(res.url);
      showToast({ type: 'success', title: 'फोटो लग गई', message: 'सामान की फोटो सफलतापूर्वक अपलोड हो गई है।' });
    } catch (err) {
      showToast({ type: 'error', title: 'अपलोड विफल', message: err.message || 'फोटो अपलोड नहीं हो सकी।' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {currentUrl ? (
        /* Image Preview Box when image is uploaded */
        <div className="space-y-2">
          <div className="relative aspect-16/9 rounded-2xl bg-[#101014] overflow-hidden border border-[#302E31] max-h-52 flex items-center justify-center">
            <img src={getFullImageUrl(currentUrl)} alt="Product Preview" className="w-full h-full object-contain" />
            
            {/* Top success badge */}
            <div className="absolute top-2.5 left-2.5 bg-[#101014]/90 text-[#70C69A] border border-[#70C69A]/30 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#70C69A]" />
              <span>फोटो लग चुकी है</span>
            </div>
          </div>

          {/* Action buttons below the photo */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#202027] hover:bg-[#D2AC68] text-[#F5F0E7] hover:text-[#0A0A0C] border border-[#302E31] hover:border-[#D2AC68] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              📷 दूसरी फोटो बदलें
            </button>
            <button
              type="button"
              onClick={() => updateUrl && updateUrl('')}
              className="px-4 py-2 bg-[#202027] text-[#F08A83] border border-[#F08A83]/30 hover:bg-[#F08A83] hover:text-[#0A0A0C] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              🗑️ फोटो हटाएं
            </button>
          </div>
        </div>
      ) : (
        /* Large Upload Area when no image */
        <div className="space-y-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#302E31] hover:border-[#D2AC68]/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#101014] hover:bg-[#17171C]"
          >
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-3 text-[#D2AC68]">
                <Loader2 className="w-7 h-7 animate-spin mb-2" />
                <span className="text-xs sm:text-sm font-semibold">फोटो अपलोड हो रही है, कृपया रुकें...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 text-[#817C77]">
                <UploadCloud className="w-9 h-9 text-[#D2AC68] mb-2 stroke-[1.5]" />
                <p className="text-xs sm:text-sm font-bold text-[#F5F0E7]">
                  फोटो लगाने के लिए यहाँ क्लिक करें (Upload Photo)
                </p>
                <p className="text-xs text-[#817C77] mt-1">
                  कंप्यूटर या फोन से JPG, PNG या WEBP फोटो चुनें
                </p>
              </div>
            )}
          </div>

          {/* Optional URL link toggle for advanced use */}
          <div>
            {!showUrlInput ? (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-xs text-[#817C77] hover:text-[#D2AC68] underline cursor-pointer"
              >
                + इंटरनेट से फोटो का लिंक (URL) डालना चाहते हैं?
              </button>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={currentUrl || ''}
                  onChange={(e) => updateUrl && updateUrl(e.target.value)}
                  placeholder="https://... इंटरनेट से फोटो का लिंक पेस्ट करें"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] outline-none focus:border-[#D2AC68]"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
      />
    </div>
  );
}
