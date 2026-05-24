'use client'

import { useStore, type Product } from '@/lib/store'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onOrder: (product: Product) => void
}

function ProductCard({ product, onOrder }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const flavorColors: Record<string, string> = {
    'Classic MisuBliss': 'from-amber-100 to-amber-200',
    'Choco MisuBliss': 'from-amber-200 to-amber-400',
    'Matcha MisuBliss': 'from-green-100 to-green-200',
  }

  const bgGradient = flavorColors[product.name] || 'from-primary/20 to-secondary/20'

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card">
      <CardHeader className="p-0">
        <div className={`aspect-square bg-gradient-to-br ${bgGradient} flex items-center justify-center relative overflow-hidden`}>
          <div className="w-32 h-32 bg-white/50 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-5xl">
              {product.name.includes('Classic') ? '☕' : 
               product.name.includes('Choco') ? '🍫' : 
               product.name.includes('Matcha') ? '🍵' : '🍰'}
            </span>
          </div>
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-semibold">
                Habis
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
        <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onOrder(product)}
          disabled={!product.isAvailable}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-full"
        >
          <ShoppingBag size={18} className="mr-2" />
          Pesan
        </Button>
      </CardFooter>
    </Card>
  )
}

interface MenuSectionProps {
  onOrderProduct: (product: Product) => void
}

export function MenuSection({ onOrderProduct }: MenuSectionProps) {
  const { products } = useStore()
  const singleProducts = products.filter((p) => p.category === 'single')

  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Menu <span className="text-primary">Tiramisu</span> Kami
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pilih varian tiramisu favorit Anda. Setiap cup dibuat dengan penuh cinta dan bahan premium.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {singleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOrder={onOrderProduct} />
          ))}
        </div>
      </div>
    </section>
  )
}
