'use client'

import { useStore } from '@/lib/store'
import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  onClick: () => void
}

export function WhatsAppButton({ onClick }: WhatsAppButtonProps) {
  const { settings } = useStore()

  const handleDirectWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo ${settings.storeName}, saya ingin memesan tiramisu`
    )
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 group"
      aria-label="Order via WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-4 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
        Pesan via WhatsApp
      </span>
    </button>
  )
}
