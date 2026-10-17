import React from 'react';
import { MapPin, Phone, Clock, Store, ShieldCheck, ExternalLink } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';

export default function ContactPage({ storeSettings }) {
  const storeName = storeSettings?.store_name || 'राजू किराना स्टोर';
  const tagline = storeSettings?.tagline || 'घर का शुद्ध राशन • आज का ताज़ा भाव';
  const address = storeSettings?.address || 'Mahamaya gali, pisid, kasdol';
  const phone = storeSettings?.contact_phone || '6266444862';
  const hours = storeSettings?.opening_hours || 'रोजाना: सुबह 7:00 से रात 10:00 तक';
  const whatsappNumber = storeSettings?.whatsapp_number || '6266444862';
  const mapsUrl = storeSettings?.google_maps_url || 'https://maps.app.goo.gl/3tPyDrjZFJjavukX8';
  const description = storeSettings?.description;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#0A0A0C] text-[#F5F0E7]">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#D2AC68] bg-[#17171C] px-3 py-1 rounded border border-[#302E31] inline-block">
          दुकान का पता व संपर्क • STORE CONTACT
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#F5F0E7] tracking-tight">
          {storeName} पर पधारें या संपर्क करें
        </h1>
        <p className="text-xs sm:text-sm text-[#817C77] max-w-xl mx-auto font-normal">
          दुकान के काउंटर पर आकर सीधे सामान लें या व्हाट्सएप पर अपनी लिस्ट भेजकर घर मंगवाएं।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Contact details */}
        <div className="bg-[#17171C] rounded-2xl border border-[#302E31] p-6 sm:p-8 midnight-card-shadow space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#302E31]">
            <div className="w-11 h-11 rounded-xl bg-[#202027] border border-[#302E31] text-[#D2AC68] flex items-center justify-center">
              <Store className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F5F0E7]">{storeName}</h2>
              <p className="text-xs text-[#D2AC68] font-medium">{tagline}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {address && (
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#202027] text-[#D2AC68] border border-[#302E31] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="space-y-2 flex-1">
                  <div>
                    <span className="text-xs font-bold text-[#817C77] block">दुकान का पूरा पता:</span>
                    <p className="text-[#F5F0E7] font-semibold text-xs sm:text-sm leading-relaxed mt-0.5">{address}</p>
                  </div>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A0A0C] bg-[#D2AC68] hover:bg-[#E8CA91] px-3.5 py-1.5 rounded-lg transition-all shadow-xs"
                      title="गूगल मैप पर दुकान का रास्ता देखें"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>गूगल मैप पर रास्ता देखें (Get Directions)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {hours && (
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#202027] text-[#D2AC68] border border-[#302E31] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#817C77] block">दुकान खुलने का समय:</span>
                  <p className="text-[#F5F0E7] font-semibold text-xs sm:text-sm leading-relaxed mt-0.5">{hours}</p>
                </div>
              </div>
            )}

            {phone && (
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#202027] text-[#D2AC68] border border-[#302E31] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#817C77] block">फोन नंबर:</span>
                  <a
                    href={`tel:${phone}`}
                    className="text-[#D2AC68] hover:text-[#E8CA91] font-bold hover:underline text-sm tabular-nums mt-0.5 block"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Direct */}
          {whatsappNumber && (
            <div className="pt-4 border-t border-[#302E31] space-y-2">
              <span className="text-xs font-bold text-[#817C77] block">
                व्हाट्सएप पर सीधी बातचीत या ऑर्डर:
              </span>
              <WhatsAppButton
                whatsappNumber={whatsappNumber}
                storeName={storeName}
                className="w-full py-3"
              />
            </div>
          )}
        </div>

        {/* Right Column: Store About */}
        <div className="bg-[#101014] rounded-2xl border border-[#302E31] p-6 sm:p-8 flex flex-col justify-between midnight-card-shadow space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#D2AC68] bg-[#17171C] px-2.5 py-0.5 rounded border border-[#302E31] inline-block">
              हमारे बारे में • ABOUT US
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F0E7] tracking-tight">
              आपके मोहल्ले की अपनी पुरानी व भरोसेमंद दुकान
            </h2>
            <p className="text-xs sm:text-sm text-[#B0AAA1] leading-relaxed font-normal">
              {description || 'राजू किराना स्टोर पर आपका स्वागत है। वर्षों से आपके मोहल्ले में शुद्ध आटा, दालें, खड़े व पिसे मसाले, तेल और दैनिक घरेलू आवश्यकताओं के लिए भरोसे का नाम।'}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-[#B0AAA1]">
                <ShieldCheck className="w-4 h-4 text-[#D2AC68] shrink-0" />
                <span>सरकारी मुहर लगा प्रमाणित डिजिटल इलेक्ट्रॉनिक कांटा</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#B0AAA1]">
                <ShieldCheck className="w-4 h-4 text-[#D2AC68] shrink-0" />
                <span>रोजाना छना और साफ किया हुआ फ्रेश राशन</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#B0AAA1]">
                <ShieldCheck className="w-4 h-4 text-[#D2AC68] shrink-0" />
                <span>बाजार की थोक मंडी के अनुसार वाजिब भाव</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#17171C] border border-[#302E31] text-xs text-[#817C77] text-center">
            बुजुर्ग ग्राहकों और माताओं-बहनों के लिए राशन का भारी बैग घर तक पहुंचाने में सहायता उपलब्ध है।
          </div>
        </div>
      </div>
    </div>
  );
}
