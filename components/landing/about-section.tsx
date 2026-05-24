'use client'

import { useState, useEffect } from 'react'
import * as db from '@/lib/supabase/db'

interface Settings {
  store_name: string
  about_title?: string
  about_description?: string
  about_image_url?: string
}

export default function AboutSection() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    db.getSettings().then(setSettings).catch(console.error)
  }, [])

  const features = [
    { icon: '🥚', title: 'Bahan Segar', desc: 'Dipilih setiap hari dari supplier terpercaya' },
    { icon: '❤️', title: 'Dibuat dengan Cinta', desc: 'Setiap kue dikerjakan dengan detail dan dedikasi' },
    { icon: '🎨', title: 'Desain Custom', desc: 'Bisa disesuaikan dengan tema dan keinginan Anda' },
    { icon: '🚚', title: 'Pengiriman Aman', desc: 'Dikemas khusus agar tiba dalam kondisi sempurna' },
  ]

  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF5F0 0%, #FFF0EB 100%)' }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #8B5E3C 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div
              className="w-full aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl"
              style={{ border: '3px solid rgba(212, 149, 106, 0.25)' }}
            >
              {settings?.about_image_url ? (
                <img
                  src={settings.about_image_url}
                  alt="About"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FADADD 0%, #F5C6A8 100%)' }}
                >
                  <div className="text-center">
                    <div className="text-8xl mb-4">👩‍🍳</div>
                    <p className="text-sm" style={{ color: '#8B5E3C' }}>Foto dari CMS</p>
                  </div>
                </div>
              )}
            </div>
            {/* Decorative card */}
            <div
              className="absolute -bottom-6 -right-6 px-5 py-4 rounded-2xl shadow-lg"
              style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(212, 149, 106, 0.2)' }}
            >
              <div className="text-2xl font-bold" style={{ color: '#C1806B', fontFamily: "'Playfair Display', serif" }}>
                5+ Tahun
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#8B6355' }}>Pengalaman Membuat Kue</div>
            </div>
          </div>

          {/* Text Side */}
          <div className="space-y-8">
            <div>
              <div
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#D4956A' }}
              >
                Tentang Kami
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold leading-tight mb-5"
                style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif" }}
              >
                {settings?.about_title || 'Kue Buatan Rumah yang Penuh Cinta'}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#7A5544' }}>
                {settings?.about_description ||
                  'Kami adalah usaha kue rumahan yang berdedikasi untuk menghadirkan kue-kue berkualitas tinggi dengan sentuhan personal. Setiap produk dibuat dengan resep rahasia turun-temurun dan bahan-bahan pilihan terbaik.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="p-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(212, 149, 106, 0.15)' }}
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-sm font-semibold mb-1" style={{ color: '#5C3D2E' }}>{f.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#8B6355' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
