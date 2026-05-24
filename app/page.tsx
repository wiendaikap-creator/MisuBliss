'use client'

import { useState } from 'react'
import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { AboutSection } from '@/components/landing/about-section'
import { MenuSection } from '@/components/landing/menu-section'
import { BundleSection } from '@/components/landing/bundle-section'
import { TestimonialSection } from '@/components/landing/testimonial-section'
import { LocationSection } from '@/components/landing/location-section'
import { Footer } from '@/components/landing/footer'
import { WhatsAppButton } from '@/components/landing/whatsapp-button'
import { OrderForm } from '@/components/landing/order-form'
import { type Product, type Bundle } from '@/lib/store'

export default function HomePage() {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [selectedBundle, setSelectedBundle] = useState<Bundle | undefined>()

  const handleOrderProduct = (product: Product) => {
    setSelectedProduct(product)
    setSelectedBundle(undefined)
    setShowOrderForm(true)
  }

  const handleOrderBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle)
    setSelectedProduct(undefined)
    setShowOrderForm(true)
  }

  const handleOpenOrderForm = () => {
    setSelectedProduct(undefined)
    setSelectedBundle(undefined)
    setShowOrderForm(true)
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MenuSection onOrderProduct={handleOrderProduct} />
      <BundleSection onOrderBundle={handleOrderBundle} />
      <TestimonialSection />
      <div id="order" className="scroll-mt-20" />
      <LocationSection />
      <Footer />
      <WhatsAppButton onClick={handleOpenOrderForm} />
      
      {showOrderForm && (
        <OrderForm
          initialProduct={selectedProduct}
          initialBundle={selectedBundle}
          onClose={() => {
            setShowOrderForm(false)
            setSelectedProduct(undefined)
            setSelectedBundle(undefined)
          }}
        />
      )}
    </main>
  )
}
