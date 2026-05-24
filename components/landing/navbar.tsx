'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import * as db from '@/lib/supabase/db'

interface NavItem {
  id: string
  label: string
  href: string
  order_index: number
}

interface Settings {
  store_name: string
  logo_url?: string
}

export default function Navbar() {
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    db.getNavItems().then(setNavItems).catch(console.error)
    db.getSettings().then(setSettings).catch(console.error)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: isScrolled
          ? 'rgba(255, 240, 235, 0.92)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(193, 154, 107, 0.15)' : 'none',
        boxShadow: isScrolled ? '0 4px 24px rgba(193, 154, 107, 0.08)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
          className="flex items-center gap-2 group"
        >
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={settings.store_name} className="h-9 w-auto" />
          ) : (
            <span
              className="text-xl font-bold tracking-tight transition-opacity group-hover:opacity-80"
              style={{ color: '#8B5E3C', fontFamily: "'Playfair Display', serif" }}
            >
              {settings?.store_name || 'Toko Kami'}
            </span>
          )}
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:bg-pink-100/60"
              style={{ color: '#8B5E3C' }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={(e) => { e.preventDefault(); scrollTo('#order') }}
            className="ml-3 px-5 py-2 text-sm font-semibold rounded-full text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
            style={{ background: 'linear-gradient(135deg, #D4956A 0%, #C1806B 100%)' }}
          >
            Pesan Sekarang
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className="block w-5 h-0.5 transition-all duration-300"
            style={{
              background: '#8B5E3C',
              transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }}
          />
          <span
            className="block w-5 h-0.5 transition-all duration-300"
            style={{
              background: '#8B5E3C',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-0.5 transition-all duration-300"
            style={{
              background: '#8B5E3C',
              transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? '400px' : '0' }}
      >
        <div
          className="px-6 pb-6 pt-2 flex flex-col gap-1"
          style={{ background: 'rgba(255, 240, 235, 0.97)', backdropFilter: 'blur(12px)' }}
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
              className="px-4 py-3 text-sm font-medium rounded-xl transition-colors hover:bg-pink-100/60"
              style={{ color: '#8B5E3C' }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={(e) => { e.preventDefault(); scrollTo('#order') }}
            className="mt-2 px-5 py-3 text-sm font-semibold rounded-xl text-white text-center transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #D4956A 0%, #C1806B 100%)' }}
          >
            Pesan Sekarang
          </a>
        </div>
      </div>
    </nav>
  )
}
