'use client'

import { useStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

export function TestimonialSection() {
  const { testimonials } = useStore()

  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Star size={18} className="fill-primary" />
            <span className="font-medium">Testimoni</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Apa Kata <span className="text-primary">Pelanggan</span> Kami
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas utama kami. Ini yang mereka katakan tentang MisuBliss.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xl font-bold text-primary overflow-hidden flex-shrink-0">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = testimonial.name.charAt(0).toUpperCase()
                        }}
                      />
                    ) : (
                      testimonial.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote size={24} className="absolute -top-1 -left-1 text-primary/20" />
                  <p className="text-muted-foreground pl-6 italic leading-relaxed">
                    {testimonial.comment}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
