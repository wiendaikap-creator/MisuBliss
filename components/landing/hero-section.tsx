'use client'

import { useStore } from '@/lib/store'
import { Sparkles } from 'lucide-react'

export function HeroSection() {
  const { settings } = useStore()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-muted/50" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Premium Tiramisu</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
              <span className="text-primary">{settings.storeName}</span>
              <br />
              <span className="text-balance">Tiramisu Lembut dan Creamy</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-secondary font-medium italic mb-8">
              {settings.tagline}
            </p>
            
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Nikmati kelezatan tiramisu premium dengan tekstur lembut dan rasa yang memanjakan. 
              Dibuat dengan bahan berkualitas tinggi untuk momen spesial Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#order"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Pesan Sekarang
              </a>
              <a
                href="#menu"
                className="bg-secondary text-secondary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-all"
              >
                Lihat Menu
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-gradient-to-tr from-accent to-card rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-secondary/40 to-primary/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-6xl">🍰</span>
                  </div>
                  <p className="text-foreground font-semibold text-lg">Tiramisu Premium</p>
                  <p className="text-muted-foreground">Kota Malang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
