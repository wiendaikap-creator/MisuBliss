'use client'

import { useState, useEffect } from 'react'
import * as db from '@/lib/supabase/db'

interface Settings {
  store_name: string
  footer_tagline?: string
  whatsapp_number?: string
  instagram_url?: string
  tiktok_url?: string
  address?: string
}

interface NavItem {
  id: string
  label: string
  href: string
  order_index: number
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function TikTokIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  )
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [navItems, setNavItems] = useState<NavItem[]>([])

  useEffect(() => {
    db.getSettings().then(setSettings).catch(console.error)
    db.getNavItems().then(setNavItems).catch(console.error)
  }, [])

  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const waNumber = settings?.whatsapp_number?.replace(/\D/g, '')
  const waLink = waNumber ? `https://wa.me/${waNumber}` : '#'

  return (
    <footer
      className="relative overflow-hidden pt-16 pb-8"
      style={{ background: 'linear-gradient(145deg, #3D2314 0%, #5C3D2E 100%)' }}
    >
      {/* Decorative top curve */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: '48px' }}>
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C480,48 960,48 1440,0 L1440,0 L0,0 Z" fill="#FFF0EB" />
        </svg>
      </div>

      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4956A 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div
              className="text-2xl font-bold"
              style={{ color: '#F5C6A8', fontFamily: "'Playfair Display', serif" }}
            >
              {settings?.store_name || 'Toko Kue'}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245, 198, 168, 0.65)' }}>
              {settings?.footer_tagline ||
                'Dibuat dengan cinta untuk setiap momen spesial Anda. Kualitas terbaik, rasa tak terlupakan.'}
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: '#25D366', color: 'white' }}
            >
              💬 Chat WhatsApp
            </a>
          </div>

          {/* Navigation */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#D4956A' }}
            >
              Navigasi
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
                    className="text-sm transition-all hover:translate-x-1 inline-block"
                    style={{ color: 'rgba(245, 198, 168, 0.65)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F5C6A8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 198, 168, 0.65)')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#D4956A' }}
            >
              Kontak
            </div>
            <div className="space-y-3">
              {settings?.address && (
                <div className="flex gap-2 text-sm" style={{ color: 'rgba(245, 198, 168, 0.65)' }}>
                  <span>📍</span>
                  <span>{settings.address}</span>
                </div>
              )}
              {settings?.whatsapp_number && (
                <div className="flex gap-2 text-sm" style={{ color: 'rgba(245, 198, 168, 0.65)' }}>
                  <span>📱</span>
                  <span>{settings.whatsapp_number}</span>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white' }}
                    title="Instagram"
                  >
                    <InstagramIcon size={18} />
                  </a>
                )}
                {settings?.tiktok_url && (
                  <a
                    href={settings.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-90"
                    style={{ background: '#010101', color: 'white' }}
                    title="TikTok"
                  >
                    <TikTokIcon size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(212, 149, 106, 0.15)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(245, 198, 168, 0.4)' }}>
            © {new Date().getFullYear()} {settings?.store_name || 'Toko Kue'}. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(245, 198, 168, 0.3)' }}>
            Made with 🩷 & ☕
          </p>
        </div>
      </div>
    </footer>
  )
}
