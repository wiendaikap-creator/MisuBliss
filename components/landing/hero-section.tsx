'use client'

import { useState, useEffect } from 'react'
import * as db from '@/lib/supabase/db'

interface Settings {
  store_name: string
  hero_title?: string
  hero_subtitle?: string
  hero_image_url?: string
  whatsapp_number?: string
}

export default function HeroSection() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    db.getSettings().then(setSettings).catch(console.error)
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #FFF0EB 0%, #FADADD 40%, #F5C6C8 70%, #EDB49B 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4956A, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C1806B, transparent 70%)' }}
      />

      {/* Floating decorative circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              background: i % 2 === 0 ? '#D4956A' : '#F4A0A0',
              top: `${10 + i * 15}%`,
              left: `${5 + i * 13}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fadeInUp">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: 'rgba(193, 128, 107, 0.12)', color: '#8B5E3C' }}
            >
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              Homemade with Love ✨
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif" }}
            >
              {settings?.hero_title || (
                <>
                  Kue Cantik,<br />
                  <span style={{ color: '#C1806B' }}>Rasa Istimewa</span>
                </>
              )}
            </h1>

            <p
              className="text-lg leading-relaxed max-w-md"
              style={{ color: '#8B6355' }}
            >
              {settings?.hero_subtitle ||
                'Dibuat dengan bahan pilihan dan penuh cinta untuk setiap momen spesial Anda. Dari ulang tahun hingga pernikahan.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => scrollTo('#menu')}
                className="px-7 py-3.5 text-sm font-semibold rounded-full text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #D4956A 0%, #C1806B 100%)' }}
              >
                Lihat Menu 🍰
              </button>
              <button
                onClick={() => scrollTo('#order')}
                className="px-7 py-3.5 text-sm font-semibold rounded-full border-2 transition-all duration-200 hover:-translate-y-0.5"
                style={{ color: '#8B5E3C', borderColor: '#D4956A', background: 'rgba(255,255,255,0.5)' }}
              >
                Pesan Sekarang
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { num: '500+', label: 'Pelanggan Puas' },
                { num: '50+', label: 'Varian Kue' },
                { num: '5★', label: 'Rating Rata-rata' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: '#C1806B', fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.num}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#8B6355' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center">
            <div
              className="relative w-72 h-72 md:w-96 md:h-96 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] overflow-hidden shadow-2xl"
              style={{ border: '4px solid rgba(255,255,255,0.6)' }}
            >
              {settings?.hero_image_url ? (
                <img
                  src={settings.hero_image_url}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FADADD 0%, #EDB49B 100%)' }}
                >
                  <div className="text-center">
                    <div className="text-7xl mb-3">🎂</div>
                    <p className="text-sm font-medium" style={{ color: '#8B5E3C' }}>
                      Foto hero dari CMS
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Decorative ring */}
            <div
              className="absolute inset-[-16px] rounded-[40%_60%_60%_40%/40%_40%_60%_60%] opacity-30 pointer-events-none"
              style={{ border: '2px dashed #D4956A', animation: 'spin 20s linear infinite' }}
            />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
        <div className="w-0.5 h-8 rounded-full" style={{ background: '#8B5E3C', animation: 'scrollCue 1.5s ease-in-out infinite' }} />
      </div>

      <style jsx>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-12px) rotate(8deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scrollCue {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out both;
        }
      `}</style>
    </section>
  )
}
