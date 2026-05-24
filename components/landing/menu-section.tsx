'use client'

import { useState, useEffect, useRef } from 'react'
import * as db from '@/lib/supabase/db'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  image?: string
  category?: string
  is_available?: boolean
}

export default function MenuSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    db.getProducts()
      .then((data) => setProducts(data.filter((p: Product) => p.is_available !== false)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))] as string[]

  const filtered =
    activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)

  const handleOrder = (product: Product) => {
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 1500)
    const el = document.querySelector('#order')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const getImage = (product: Product) => product.image_url || product.image

  // Mouse drag scroll
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    scrollRef.current.scrollLeft = scrollLeft - (x - startX)
  }
  const onMouseUp = () => setIsDragging(false)

  return (
    <section
      id="menu"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF0EB 0%, #FADADD 50%, #FFF0EB 100%)' }}
    >
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none" style={{ height: '60px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#FFF5F0" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-block text-sm font-semibold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(212, 149, 106, 0.12)', color: '#D4956A' }}
          >
            Menu Kami
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif" }}
          >
            Koleksi Kue Pilihan
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#8B6355' }}>
            Setiap kue dibuat segar setiap hari dengan bahan-bahan berkualitas tinggi
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize"
                style={
                  activeCategory === cat
                    ? { background: 'linear-gradient(135deg, #D4956A, #C1806B)', color: 'white' }
                    : { background: 'rgba(255,255,255,0.7)', color: '#8B5E3C', border: '1px solid rgba(212, 149, 106, 0.25)' }
                }
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Cards — horizontal swipe on mobile, grid on desktop */}
        {loading ? (
          <>
            {/* Mobile skeleton */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:hidden" style={{ scrollbarWidth: 'none' }}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.6)', width: '240px', height: '360px' }}
                />
              ))}
            </div>
            {/* Desktop skeleton */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.6)', height: '380px' }}
                />
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍰</div>
            <p style={{ color: '#8B6355' }}>Belum ada produk tersedia</p>
          </div>
        ) : (
          <>
            {/* Mobile: horizontal swipe */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 md:hidden select-none"
              style={{ scrollbarWidth: 'none', cursor: isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl overflow-hidden flex-shrink-0 flex flex-col"
                  style={{
                    width: '240px',
                    scrollSnapAlign: 'start',
                    background: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(212, 149, 106, 0.15)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: '180px' }}>
                    {getImage(product) ? (
                      <img
                        src={getImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-5xl"
                        style={{ background: 'linear-gradient(135deg, #FADADD, #F5C6A8)' }}
                      >
                        🎂
                      </div>
                    )}
                    {product.category && (
                      <span
                        className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(255,255,255,0.9)', color: '#8B5E3C' }}
                      >
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#5C3D2E' }}>
                      {product.name}
                    </h3>
                    <p className="text-xs mb-3 leading-relaxed flex-1" style={{ color: '#8B6355' }}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-sm" style={{ color: '#C1806B', fontFamily: "'Playfair Display', serif" }}>
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => handleOrder(product)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-95"
                        style={{
                          background:
                            addedToCart === product.id
                              ? '#6BA86B'
                              : 'linear-gradient(135deg, #D4956A, #C1806B)',
                        }}
                      >
                        {addedToCart === product.id ? '✓ OK' : 'Pesan'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer flex flex-col"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(212, 149, 106, 0.15)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: '200px' }}>
                    {getImage(product) ? (
                      <img
                        src={getImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-5xl"
                        style={{ background: 'linear-gradient(135deg, #FADADD, #F5C6A8)' }}
                      >
                        🎂
                      </div>
                    )}
                    {product.category && (
                      <span
                        className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(255,255,255,0.9)', color: '#8B5E3C' }}
                      >
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#5C3D2E' }}>
                      {product.name}
                    </h3>
                    <p className="text-xs mb-3 leading-relaxed flex-1" style={{ color: '#8B6355' }}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-sm" style={{ color: '#C1806B', fontFamily: "'Playfair Display', serif" }}>
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => handleOrder(product)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-95"
                        style={{
                          background:
                            addedToCart === product.id
                              ? '#6BA86B'
                              : 'linear-gradient(135deg, #D4956A, #C1806B)',
                        }}
                      >
                        {addedToCart === product.id ? '✓ OK' : 'Pesan'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
