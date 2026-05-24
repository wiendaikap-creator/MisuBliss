import Navbar from '@/components/landing/navbar'
import HeroSection from '@/components/landing/hero-section'
import AboutSection from '@/components/landing/about-section'
import MenuSection from '@/components/landing/menu-section'
import BundleSection from '@/components/landing/bundle-section'
import TestimonialSection from '@/components/landing/testimonial-section'
import OrderForm from '@/components/landing/order-form'
import LocationSection from '@/components/landing/location-section'
import Footer from '@/components/landing/footer'
import WhatsAppButton from '@/components/landing/whatsapp-button'

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <BundleSection />
      <TestimonialSection />
      <OrderForm />
      <LocationSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
