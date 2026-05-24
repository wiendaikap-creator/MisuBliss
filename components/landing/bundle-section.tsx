'use client'

import { useStore, type Bundle } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gift, Check } from 'lucide-react'

interface BundleSectionProps {
  onOrderBundle: (bundle: Bundle) => void
}

export function BundleSection({ onOrderBundle }: BundleSectionProps) {
  const { bundles } = useStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (bundles.length === 0) return null

  return (
    <section id="bundle" className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full mb-4">
            <Gift size={18} />
            <span className="font-medium">Paket Hemat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Bundle <span className="text-primary">Spesial</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nikmati semua varian dalam satu paket hemat. Cocok untuk berbagi atau mencoba semua rasa.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="overflow-hidden border-2 border-primary/20 shadow-2xl">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="bg-gradient-to-br from-primary/20 via-accent to-secondary/20 p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <div className="flex justify-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-3xl">☕</span>
                        </div>
                        <div className="w-20 h-20 bg-amber-300 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-3xl">🍫</span>
                        </div>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-3xl">🍵</span>
                        </div>
                      </div>
                      <p className="text-foreground font-semibold text-lg">Varian Lengkap dalam 1 Paket</p>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{bundle.name}</h3>
                    <p className="text-muted-foreground mb-6">{bundle.description}</p>
                    
                    <ul className="space-y-3 mb-6">
                      {bundle.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-primary" />
                          </div>
                          <span className="text-foreground/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground line-through">{formatPrice(bundle.originalPrice)}</p>
                        <p className="text-3xl font-bold text-primary">{formatPrice(bundle.price)}</p>
                      </div>
                      <Button
                        onClick={() => onOrderBundle(bundle)}
                        disabled={!bundle.isAvailable}
                        size="lg"
                        className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-8"
                      >
                        <Gift size={18} className="mr-2" />
                        Pesan Bundle
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
