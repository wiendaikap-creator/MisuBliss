'use client'

import { useState, useEffect, useRef } from 'react'
import * as db from '@/lib/supabase/db'

interface Testimonial {
  id: string
  name: string        // kolom DB: name
  comment: string     // kolom DB: comment
  rating: number
  image?: string      // kolom DB: image
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const autoRef = useRef<NodeJS.Timeout | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    db.getTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (testimonials.length <= 1) return
    autoRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [testimonials.length])

  const goTo = (index: number) => {
    setCurrent(index)
    if (autoRef.current) clearInterval(autoRef.current)
  }

  useEffect(() => {
    if (!scrollRef.current) return
    const card = scrollRef.current.children[current] as HTMLElement
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [current])

  if (!loading && testimonials.length === 0) return null

  const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating)

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
      id="testimonials"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF5F7 0%, #FFF0EB 100%)' }}
    >
      {/* Large decorative quote */}
      <div
        className="absolute top-12 left-8 text-[180px] leading-none font-serif opacity-[0.04] select-none pointer-events-none"
        style={{ color: '#C1806B' }}
      >
        "
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-block text-sm font-semibold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(212, 149, 106, 0.12)', color: '#D4956A' }}
          >
            Testimoni
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif" }}
          >
            Kata Mereka Tentang Kami
          </h2>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.6)', width: '320px', height: '260px' }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Horizontal scrollable cards */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-4 select-none"
              style={{ scrollbarWidth: 'none', cursor: isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  onClick={() => goTo(i)}
                  className="rounded-3xl p-6 md:p-8 flex-shrink-0 flex flex-col transition-all duration-300 cursor-pointer"
                  style={{
                    width: 'clamp(280px, 80vw, 380px)',
                    scrollSnapAlign: 'center',
                    background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)',
                    border: i === current ? '2px solid rgba(212, 149, 106, 0.4)' : '1px solid rgba(212, 149, 106, 0.12)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: i === current ? '0 8px 32px rgba(193,128,107,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: i === current ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {/* Avatar + Nama */}
                  <div className="flex items-center gap-3 mb-4">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover shadow-md flex-shrink-0"
                        style={{ border: '3px solid rgba(212, 149, 106, 0.3)' }}
                        draggable={false}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #FADADD, #F5C6A8)',
                          color: '#C1806B',
                          border: '3px solid rgba(212, 149, 106, 0.3)',
                        }}
                      >
                        {t.name?.charAt(0)?.toUpperCase() || 'K'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#5C3D2E' }}>
                        {t.name}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="text-base mb-3" style={{ color: '#F5A623' }}>
                    {stars(t.rating || 5)}
                  </div>

                  {/* Komentar */}
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                  >
                    "{t.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Dots */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? '24px' : '8px',
                      height: '8px',
                      background: i === current ? '#C1806B' : 'rgba(193, 128, 107, 0.25)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Navigasi panah (desktop) */}
            {testimonials.length > 1 && (
              <div className="hidden md:flex justify-center gap-3 mt-6">
                <button
                  onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:shadow-lg text-lg"
                  style={{ background: 'white', color: '#C1806B' }}
                >
                  ‹
                </button>
                <button
                  onClick={() => goTo((current + 1) % testimonials.length)}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:shadow-lg text-lg"
                  style={{ background: 'white', color: '#C1806B' }}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}

        {/* Summary stats */}
        {!loading && testimonials.length > 0 && (
          <div className="flex justify-center gap-12 mt-12 pt-8" style={{ borderTop: '1px solid rgba(212, 149, 106, 0.15)' }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#C1806B', fontFamily: "'Playfair Display', serif" }}>
                {(testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)}
              </div>
              <div className="text-sm mt-1" style={{ color: '#8B6355' }}>Rating Rata-rata</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#C1806B', fontFamily: "'Playfair Display', serif" }}>
                {testimonials.length}+
              </div>
              <div className="text-sm mt-1" style={{ color: '#8B6355' }}>Ulasan Pelanggan</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
