import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2, CheckCircle2, Trash2, Link as LinkIcon } from 'lucide-react';
import { uploadImage } from '../../api/settings';
import { getFullImageUrl } from '../../api/client';
import { compressImage, formatBytes } from '../../utils/imageCompressor';

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
  const [compressing, setCompressing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [fileSizeInfo, setFileSizeInfo] = useState('');

  // Dual file input refs: Camera (capture="environment") vs Gallery / File picker
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const processAndUploadFile = async (rawFile) => {
    if (!rawFile) return;

    // Validate image mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg', 'image/heic', 'image/heif'];
    if (!validTypes.includes(rawFile.type) && !rawFile.type.startsWith('image/')) {
      showToast?.({
        type: 'error',
        title: 'गलत फॉर्मेट',
        message: 'कृपया केवल फोटो (JPG, PNG या WEBP) ही चुनें।',
      });
      return;
    }

    const originalSize = rawFile.size;

    try {
      setUploading(true);
      setCompressing(true);

      // Automatically compress and resize camera photos from e.g. 10MB down to ~150-250KB
      const compressedFile = await compressImage(rawFile, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82,
        targetType: 'image/jpeg',
      });

      setCompressing(false);

      const compressedSize = compressedFile.size;
      const sizeSummary = `${formatBytes(compressedSize)}`;
      setFileSizeInfo(sizeSummary);

      // Upload the lightweight, compressed image
      const res = await uploadImage(compressedFile);
      if (updateUrl) updateUrl(res.url);

      const sizeSavedText =
        originalSize > compressedSize && originalSize > 500 * 1024
          ? ` (साइज ${formatBytes(originalSize)} से घटाकर ${sizeSummary} कर दिया गया)`
          : '';

      showToast?.({
        type: 'success',
        title: 'फोटो लग गई!',
        message: `सामान की फोटो सुरक्षित हो गई है${sizeSavedText}।`,
      });
    } catch (err) {
      showToast?.({
        type: 'error',
        title: 'अपलोड विफल',
        message: err.message || 'फोटो अपलोड नहीं हो सकी। कृपया दोबारा प्रयास करें।',
      });
    } finally {
      setUploading(false);
      setCompressing(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Inputs */}
      {/* 1. Direct Camera Input (capture="environment" directly launches phone camera) */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* 2. Gallery / File Input for picking existing photos */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/png,image/webp,image/avif,image/jpg,image/*"
        className="hidden"
      />

      {currentUrl ? (
        /* Image Preview Box when image is uploaded */
        <div className="space-y-2.5">
          <div className="relative aspect-16/9 rounded-2xl bg-[#101014] overflow-hidden border border-[#302E31] max-h-56 flex items-center justify-center group">
            <img
              src={getFullImageUrl(currentUrl)}
              alt="Product Preview"
              className="w-full h-full object-contain"
            />

            {/* Top badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
              <div className="bg-[#101014]/90 text-[#70C69A] border border-[#70C69A]/30 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#70C69A]" />
                <span>फोटो लग चुकी है</span>
              </div>
              {fileSizeInfo && (
                <div className="bg-[#101014]/90 text-[#D2AC68] border border-[rgba(210,172,104,0.3)] px-2 py-1 rounded-lg text-[11px] font-bold shadow-md">
                  {fileSizeInfo}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons below the photo */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#202027] hover:bg-[#D2AC68] text-[#F5F0E7] hover:text-[#0A0A0C] border border-[#302E31] hover:border-[#D2AC68] rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5 text-[#D2AC68] group-hover:text-[#0A0A0C]" />
              <span>📷 कैमरा से नई फोटो लें</span>
            </button>

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#202027] hover:bg-[#D2AC68] text-[#F5F0E7] hover:text-[#0A0A0C] border border-[#302E31] hover:border-[#D2AC68] rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#B0AAA1]" />
              <span>📁 गैलरी से बदलें</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (updateUrl) updateUrl('');
                setFileSizeInfo('');
              }}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#202027] text-[#F08A83] border border-[#F08A83]/30 hover:bg-[#F08A83] hover:text-[#0A0A0C] rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>फोटो हटाएं</span>
            </button>
          </div>
        </div>
      ) : (
        /* Upload Action Buttons Box */
        <div className="space-y-3">
          {/* Dual Action Options: Direct Camera vs Phone Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Camera Button */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 p-4 rounded-2xl bg-[#17171C] hover:bg-[#202027] border-2 border-dashed border-[#D2AC68]/60 hover:border-[#D2AC68] transition-all cursor-pointer text-left group shadow-sm disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#202027] group-hover:bg-[#D2AC68] text-[#D2AC68] group-hover:text-[#0A0A0C] flex items-center justify-center shrink-0 transition-colors shadow-xs">
                <Camera className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-sm font-bold block text-[#F5F0E7] group-hover:text-[#E8CA91]">
                  📷 कैमरा से फोटो खींचें
                </span>
                <span className="text-xs text-[#817C77] block mt-0.5">
                  सीधा फोन का कैमरा खोलें और सामान की फोटो लें
                </span>
              </div>
            </button>

            {/* Gallery / File Picker Button */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 p-4 rounded-2xl bg-[#17171C] hover:bg-[#202027] border-2 border-dashed border-[#302E31] hover:border-[#D2AC68]/50 transition-all cursor-pointer text-left group shadow-sm disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#202027] group-hover:bg-[#302E31] text-[#B0AAA1] group-hover:text-[#D2AC68] flex items-center justify-center shrink-0 transition-colors shadow-xs">
                <ImageIcon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-sm font-bold block text-[#F5F0E7] group-hover:text-[#E8CA91]">
                  📁 गैलरी / फाइल से चुनें
                </span>
                <span className="text-xs text-[#817C77] block mt-0.5">
                  फोन की गैलरी या मेमोरी से पहले से रखी फोटो चुनें
                </span>
              </div>
            </button>
          </div>



          {/* Uploading Status Progress */}
          {uploading && (
            <div className="p-4 rounded-xl bg-[#17171C] border border-[#D2AC68]/40 flex items-center justify-center gap-3 text-[#D2AC68] animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" />
              <div>
                <span className="text-xs sm:text-sm font-bold block text-[#F5F0E7]">
                  {compressing
                    ? 'फोटो का साइज कम (Compress) किया जा रहा है...'
                    : 'फोटो दुकान में अपलोड हो रही है...'}
                </span>
                <span className="text-[11px] text-[#817C77]">
                  कृपया 1 से 2 सेकंड रुकें...
                </span>
              </div>
            </div>
          )}

          {/* Optional URL link toggle */}
          <div className="pt-1">
            {!showUrlInput ? (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-xs text-[#817C77] hover:text-[#D2AC68] inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LinkIcon className="w-3 h-3" />
                <span>+ इंटरनेट से फोटो का लिंक (URL) डालना चाहते हैं?</span>
              </button>
            ) : (
              <div className="p-3 bg-[#101014] rounded-xl border border-[#302E31] space-y-2">
                <label className="text-xs font-semibold text-[#B0AAA1] block">
                  फोटो का इंटरनेट लिंक (Image URL):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentUrl || ''}
                    onChange={(e) => updateUrl && updateUrl(e.target.value)}
                    placeholder="https://... इंटरनेट से फोटो का लिंक पेस्ट करें"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#17171C] text-[#F5F0E7] placeholder-[#817C77] rounded-lg border border-[#302E31] outline-none focus:border-[#D2AC68]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="px-3 py-2 text-xs text-[#817C77] hover:text-[#F5F0E7] bg-[#17171C] rounded-lg border border-[#302E31]"
                  >
                    बंद करें
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
