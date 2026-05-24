'use client'

import { useState } from 'react'
import { useStore, type Product, type Bundle } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus, Minus, Send } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderFormProps {
  initialProduct?: Product
  initialBundle?: Bundle
  onClose: () => void
}

export function OrderForm({ initialProduct, initialBundle, onClose }: OrderFormProps) {
  const { products, bundles, settings, addOrder } = useStore()
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phone: '',
    pickupDate: '',
  })
  
  const getInitialItems = (): OrderItem[] => {
    if (initialProduct) {
      return [{ id: initialProduct.id, name: initialProduct.name, price: initialProduct.price, quantity: 1 }]
    }
    if (initialBundle) {
      return [{ id: `bundle-${initialBundle.id}`, name: initialBundle.name, price: initialBundle.price, quantity: 1 }]
    }
    return []
  }
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>(getInitialItems())

  const availableProducts = products.filter((p) => p.isAvailable)
  const availableBundles = bundles.filter((b) => b.isAvailable)

  const addItem = (item: { id: string; name: string; price: number }) => {
    const existing = orderItems.find((orderItem) => orderItem.id === item.id)
    if (existing) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      )
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }])
    }
  }

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setOrderItems(
      orderItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const generateWhatsAppMessage = () => {
    const itemsList = orderItems
      .map((item) => `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`)
      .join('\n')

    return `Halo MisuBliss, saya ingin memesan tiramisu

*Data Pemesan:*
Nama: ${formData.customerName}
Alamat: ${formData.address}
No. HP: ${formData.phone}
Tanggal Pickup: ${formData.pickupDate}

*Pesanan:*
${itemsList}

*Total: ${formatPrice(totalAmount)}*

Terima kasih!`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (orderItems.length === 0) {
      alert('Silakan pilih minimal satu produk')
      return
    }

    // Save order to store
    addOrder({
      customerName: formData.customerName,
      address: formData.address,
      phone: formData.phone,
      items: orderItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      pickupDate: formData.pickupDate,
      status: 'pending',
      totalAmount,
    })

    // Generate WhatsApp link and redirect
    const message = encodeURIComponent(generateWhatsAppMessage())
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
    
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle className="text-2xl text-foreground">Form Pemesanan</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={24} />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Data Pemesan</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Masukkan nama Anda"
                    required
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">No. HP / WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    required
                    className="bg-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Masukkan alamat lengkap"
                  required
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupDate">Tanggal Pickup</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="bg-input"
                />
              </div>
            </div>

            {/* Product Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Pilih Menu</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableProducts.map((product) => (
                  <Button
                    key={product.id}
                    type="button"
                    variant="outline"
                    className="h-auto py-3 flex flex-col items-center gap-1 hover:bg-primary/10 hover:border-primary"
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                  >
                    <span className="text-sm font-medium text-foreground">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{formatPrice(product.price)}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Bundle Selection */}
            {availableBundles.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Paket Bundle</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableBundles.map((bundle) => (
                    <Button
                      key={bundle.id}
                      type="button"
                      variant="outline"
                      className="h-auto py-3 flex flex-col items-center gap-1 hover:bg-primary/10 hover:border-primary"
                      onClick={() => addItem({ id: `bundle-${bundle.id}`, name: bundle.name, price: bundle.price })}
                    >
                      <span className="text-sm font-medium text-foreground">{bundle.name}</span>
                      <span className="text-xs text-muted-foreground">{formatPrice(bundle.price)}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            {orderItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Pesanan Anda</h3>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus size={14} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-full py-6 text-lg"
              disabled={orderItems.length === 0}
            >
              <Send size={20} className="mr-2" />
              Kirim Pesanan via WhatsApp
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
