'use client'

import { useState, useEffect, useRef } from 'react'
import * as db from '@/lib/supabase/db'

interface Bundle {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  image_url?: string
  image?: string
  items?: string[]
  is_featured?: boolean
}

export default function BundleSection() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    db.getBundles()
      .then(setBundles)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  const discount = (original: number, price: number) =>
    Math.round(((original - price) / original) * 100)

  const scrollToOrder = () => {
    const el = document.querySelector('#order')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const getImage = (bundle: Bundle) => bundle.image_url || bundle.image

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

  if (!loading && bundles.length === 0) return null

  const BundleCard = ({ bundle, index }: { bundle: Bundle; index: number }) => {
    const isFeatured = bundle.is_featured || index === 0
    return (
      <div
        className="relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
        style={
          isFeatured
            ? {
                background: 'linear-gradient(145deg, #D4956A 0%, #C1806B 100%)',
                border: '2px solid rgba(255,255,255,0.3)',
              }
            : {
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(212, 149, 106, 0.2)',
              }
        }
      >
        {isFeatured && (
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10"
            style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}
          >
            ⭐ Terpopuler
          </div>
        )}

        {/* Image */}
        {getImage(bundle) ? (
          <div className="overflow-hidden" style={{ height: '180px' }}>
            <img
              src={getImage(bundle)}
              alt={bundle.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center text-6xl"
            style={{
              height: '180px',
              background: isFeatured
                ? 'rgba(255,255,255,0.15)'
                : 'linear-gradient(135deg, #FADADD, #F5C6A8)',
            }}
          >
            🎁
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <h3
            className="text-lg font-bold mb-2"
            style={{
              color: isFeatured ? 'white' : '#5C3D2E',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {bundle.name}
          </h3>
          <p
            className="text-sm mb-4 leading-relaxed"
            style={{ color: isFeatured ? 'rgba(255,255,255,0.85)' : '#8B6355' }}
          >
            {bundle.description}
          </p>

          {bundle.items && bundle.items.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {bundle.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: isFeatured ? 'rgba(255,255,255,0.9)' : '#7A5544' }}
                >
                  <span style={{ color: isFeatured ? 'rgba(255,255,255,0.7)' : '#D4956A' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-end justify-between mt-auto pt-4">
            <div>
              {bundle.original_price && (
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs line-through"
                    style={{ color: isFeatured ? 'rgba(255,255,255,0.5)' : '#B0887A' }}
                  >
                    {formatPrice(bundle.original_price)}
                  </span>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{
                      background: isFeatured ? 'rgba(255,255,255,0.2)' : '#FADADD',
                      color: isFeatured ? 'white' : '#C1806B',
                    }}
                  >
                    -{discount(bundle.original_price, bundle.price)}%
                  </span>
                </div>
              )}
              <div
                className="text-xl font-bold"
                style={{
                  color: isFeatured ? 'white' : '#C1806B',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {formatPrice(bundle.price)}
              </div>
            </div>
            <button
              onClick={scrollToOrder}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              style={
                isFeatured
                  ? { background: 'white', color: '#C1806B' }
                  : { background: 'linear-gradient(135deg, #D4956A, #C1806B)', color: 'white' }
              }
            >
              Pilih Paket
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      id="bundles"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF0EB 0%, #FFF5F7 100%)' }}
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v5h5v5H0v5h20v-5h5v5h15v-5H25v-5h15v-5H20z' fill='%238B5E3C' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-block text-sm font-semibold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(212, 149, 106, 0.12)', color: '#D4956A' }}
          >
            Paket Hemat
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif" }}
          >
            Bundle Spesial Kami
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#8B6355' }}>
            Hemat lebih banyak dengan paket pilihan kami — cocok untuk acara maupun hadiah
          </p>
        </div>

        {loading ? (
          <>
            {/* Mobile skeleton */}
            <div className="flex gap-5 overflow-x-auto pb-4 md:hidden" style={{ scrollbarWidth: 'none' }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl animate-pulse flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.6)', width: '280px', height: '400px' }}
                />
              ))}
            </div>
            {/* Desktop skeleton */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.6)', height: '380px' }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Mobile: horizontal swipe */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-4 md:hidden select-none"
              style={{ scrollbarWidth: 'none', cursor: isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {bundles.map((bundle, index) => (
                <div
                  key={bundle.id}
                  className="flex-shrink-0"
                  style={{ width: '280px', scrollSnapAlign: 'start' }}
                >
                  <BundleCard bundle={bundle} index={index} />
                </div>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle, index) => (
                <BundleCard key={bundle.id} bundle={bundle} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
