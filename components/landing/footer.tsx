'use client'

import { useStore } from '@/lib/store'
import { Instagram } from 'lucide-react'

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  )
}

export function Footer() {
  const { settings } = useStore()

  return (
    <footer className="bg-secondary/10 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2">{settings.storeName}</h3>
            <p className="text-muted-foreground italic mb-4">{settings.tagline}</p>
            <p className="text-muted-foreground text-sm">
              Tiramisu premium dengan bahan berkualitas tinggi untuk momen spesial Anda di Kota Malang.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p>{settings.address}</p>
              <p>WhatsApp: +{settings.whatsappNumber.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a
                href={settings.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={settings.tiktokUrl || 'https://tiktok.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
