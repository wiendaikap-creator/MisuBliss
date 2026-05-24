'use client'

import { useState, useEffect } from 'react'
import * as db from '@/lib/supabase/db'

interface Settings {
  store_name: string
  address?: string
  phone?: string
  whatsapp_number?: string
  open_hours?: string
  maps_embed_url?: string
  instagram_url?: string
  tiktok_url?: string
}

export default function LocationSection() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    db.getSettings().then(setSettings).catch(console.error)
  }, [])

  const waNumber = settings?.whatsapp_number?.replace(/\D/g, '')
  const waLink = waNumber ? `https://wa.me/${waNumber}` : '#'

  return (
    <section
      id="location"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF5F7 0%, #FFF0EB 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-block text-sm font-semibold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(212, 149, 106, 0.12)', color: '#D4956A' }}
          >
            Lokasi Kami
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif" }}
          >
            Temukan Kami
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              {
                icon: '📍',
                title: 'Alamat',
                value: settings?.address || 'Alamat tersedia di CMS',
              },
              {
                icon: '📞',
                title: 'Telepon / WhatsApp',
                value: settings?.phone || settings?.whatsapp_number || 'Nomor tersedia di CMS',
                href: waLink,
              },
              {
                icon: '🕐',
                title: 'Jam Operasional',
                value: settings?.open_hours || 'Senin – Sabtu, 08.00 – 17.00 WIB',
              },
            ].map((info) => (
              <div
                key={info.title}
                className="flex gap-4 p-5 rounded-2xl transition-all duration-200 hover:shadow-md"
                style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(212, 149, 106, 0.15)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FADADD, #F5C6A8)' }}
                >
                  {info.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#D4956A' }}>
                    {info.title}
                  </div>
                  {info.href ? (
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{ color: '#5C3D2E' }}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <div className="text-sm font-medium" style={{ color: '#5C3D2E' }}>{info.value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Social media */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(212, 149, 106, 0.15)' }}
            >
              <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#D4956A' }}>
                Media Sosial
              </div>
              <div className="flex gap-3">
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
                    style={{ background: 'linear-gradient(135deg, #FADADD, #F5C6A8)', color: '#8B5E3C' }}
                  >
                    📸 Instagram
                  </a>
                )}
                {settings?.tiktok_url && (
                  <a
                    href={settings.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
                    style={{ background: 'rgba(0,0,0,0.05)', color: '#5C3D2E' }}
                  >
                    🎵 TikTok
                  </a>
                )}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:shadow-md hover:opacity-90"
                  style={{ background: '#25D366' }}
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div
            className="w-full rounded-3xl overflow-hidden shadow-lg"
            style={{ height: '380px', border: '2px solid rgba(212, 149, 106, 0.2)' }}
          >
            {settings?.maps_embed_url ? (
              <iframe
                src={settings.maps_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #FADADD, #F5C6A8)' }}
              >
                <div className="text-5xl">🗺️</div>
                <p className="text-sm font-medium" style={{ color: '#8B5E3C' }}>
                  Tambahkan Google Maps Embed URL di CMS
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
