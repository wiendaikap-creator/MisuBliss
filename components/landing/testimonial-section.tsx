'use client'

import { useState, useEffect, useRef } from 'react'
import * as db from '@/lib/supabase/db'

interface Testimonial {
  id: string
  customer_name: string
  message: string
  rating: number
  avatar_url?: string
  product_name?: string
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const autoRef = useRef<NodeJS.Timeout | null>(null)

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

  if (!loading && testimonials.length === 0) return null

  const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating)

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

      <div className="max-w-4xl mx-auto px-6">
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
          <div className="animate-pulse rounded-3xl h-48" style={{ background: 'rgba(255,255,255,0.6)' }} />
        ) : (
          <>
            {/* Testimonial Card */}
            <div className="relative">
              <div
                key={current}
                className="rounded-3xl p-8 md:p-12 text-center transition-all duration-500 shadow-lg"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(212, 149, 106, 0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Avatar */}
                <div className="flex justify-center mb-5">
                  {testimonials[current]?.avatar_url ? (
                    <img
                      src={testimonials[current].avatar_url}
                      alt={testimonials[current].customer_name}
                      className="w-16 h-16 rounded-full object-cover shadow-md"
                      style={{ border: '3px solid rgba(212, 149, 106, 0.3)' }}
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #FADADD, #F5C6A8)',
                        color: '#C1806B',
                        border: '3px solid rgba(212, 149, 106, 0.3)',
                      }}
                    >
                      {testimonials[current]?.customer_name?.charAt(0)?.toUpperCase() || 'K'}
                    </div>
                  )}
                </div>

                {/* Stars */}
                <div className="text-xl mb-4" style={{ color: '#F5A623' }}>
                  {stars(testimonials[current]?.rating || 5)}
                </div>

                {/* Message */}
                <p
                  className="text-lg leading-relaxed mb-6 max-w-2xl mx-auto"
                  style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                >
                  "{testimonials[current]?.message}"
                </p>

                {/* Name */}
                <div>
                  <div className="font-semibold" style={{ color: '#5C3D2E' }}>
                    {testimonials[current]?.customer_name}
                  </div>
                  {testimonials[current]?.product_name && (
                    <div className="text-sm mt-0.5" style={{ color: '#8B6355' }}>
                      membeli {testimonials[current].product_name}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation arrows */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)}
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:shadow-lg"
                    style={{ background: 'white', color: '#C1806B' }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => goTo((current + 1) % testimonials.length)}
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:shadow-lg"
                    style={{ background: 'white', color: '#C1806B' }}
                  >
                    ›
                  </button>
                </>
              )}
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
