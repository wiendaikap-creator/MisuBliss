'use client'

import { useState, useEffect } from 'react'
import * as db from '@/lib/supabase/db'

interface Product {
  id: string
  name: string
  price: number
  is_available?: boolean
}

interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
}

export default function OrderForm() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    pickupDate: '',
    notes: '',
  })

  useEffect(() => {
    db.getProducts()
      .then((data) => setProducts(data.filter((p: Product) => p.is_available !== false)))
      .catch(console.error)
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  const updateCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id)
      if (qty <= 0) return prev.filter((c) => c.productId !== product.id)
      if (existing) return prev.map((c) => c.productId === product.id ? { ...c, quantity: qty } : c)
      return [...prev, { productId: product.id, productName: product.name, price: product.price, quantity: qty }]
    })
  }

  const getQty = (productId: string) => cart.find((c) => c.productId === productId)?.quantity || 0

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async () => {
    if (!form.customerName || !form.phone || !form.address || !form.pickupDate || cart.length === 0) {
      alert('Mohon lengkapi semua data dan pilih minimal 1 produk')
      return
    }
    setSubmitting(true)
    try {
      await db.addOrder({
        customer_name: form.customerName,
        phone: form.phone,
        address: form.address,
        pickup_date: form.pickupDate,
        notes: form.notes,
        items: cart.map(({ productId, productName, price, quantity }) => ({ productId, productName, price, quantity })),
        total_amount: total,
        status: 'pending',
      })
      setSuccess(true)
      setCart([])
      setForm({ customerName: '', phone: '', address: '', pickupDate: '', notes: '' })
    } catch (err) {
      console.error(err)
      alert('Gagal mengirim pesanan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  if (success) {
    return (
      <section id="order" className="py-24" style={{ background: '#FFF0EB' }}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <div
            className="rounded-3xl p-12 shadow-lg"
            style={{ background: 'white', border: '1px solid rgba(212, 149, 106, 0.2)' }}
          >
            <div className="text-6xl mb-5">🎉</div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif" }}
            >
              Pesanan Diterima!
            </h3>
            <p className="mb-6" style={{ color: '#8B6355' }}>
              Terima kasih telah memesan. Kami akan segera menghubungi Anda untuk konfirmasi pesanan.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3 rounded-full text-white font-semibold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #D4956A, #C1806B)' }}
            >
              Pesan Lagi
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="order"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF0EB 0%, #FADADD 100%)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-block text-sm font-semibold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(212, 149, 106, 0.12)', color: '#D4956A' }}
          >
            Formulir Pesanan
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#5C3D2E', fontFamily: "'Playfair Display', serif" }}
          >
            Pesan Kue Sekarang
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#8B6355' }}>
            Isi formulir di bawah dan kami akan menghubungi Anda untuk konfirmasi
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Product Selection */}
          <div
            className="rounded-3xl p-6 space-y-4"
            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(212, 149, 106, 0.15)' }}
          >
            <h3 className="font-bold text-base" style={{ color: '#5C3D2E' }}>Pilih Produk</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {products.map((product) => {
                const qty = getQty(product.id)
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-2xl transition-all"
                    style={{
                      background: qty > 0 ? 'rgba(212, 149, 106, 0.08)' : 'rgba(255,255,255,0.5)',
                      border: `1px solid ${qty > 0 ? 'rgba(212, 149, 106, 0.3)' : 'rgba(212, 149, 106, 0.1)'}`,
                    }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#5C3D2E' }}>{product.name}</div>
                      <div className="text-xs" style={{ color: '#C1806B' }}>{formatPrice(product.price)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCart(product, qty - 1)}
                        disabled={qty === 0}
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition-all disabled:opacity-30"
                        style={{ background: 'rgba(193, 128, 107, 0.15)', color: '#C1806B' }}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold" style={{ color: '#5C3D2E' }}>{qty}</span>
                      <button
                        onClick={() => updateCart(product, qty + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #D4956A, #C1806B)' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
              {products.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: '#8B6355' }}>Memuat produk...</p>
              )}
            </div>

            {/* Cart summary */}
            {cart.length > 0 && (
              <div className="pt-4 space-y-2 border-t" style={{ borderColor: 'rgba(212, 149, 106, 0.15)' }}>
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span style={{ color: '#5C3D2E' }}>{item.productName} x{item.quantity}</span>
                    <span style={{ color: '#C1806B' }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div
                  className="flex justify-between font-bold pt-2 border-t"
                  style={{ borderColor: 'rgba(212, 149, 106, 0.15)', color: '#5C3D2E' }}
                >
                  <span>Total</span>
                  <span style={{ color: '#C1806B', fontFamily: "'Playfair Display', serif" }}>{formatPrice(total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Customer Info */}
          <div
            className="rounded-3xl p-6 space-y-4"
            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(212, 149, 106, 0.15)' }}
          >
            <h3 className="font-bold text-base" style={{ color: '#5C3D2E' }}>Data Pemesan</h3>

            {[
              { key: 'customerName', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama Anda' },
              { key: 'phone', label: 'Nomor WhatsApp', type: 'tel', placeholder: '08xxxxxxxxxx' },
              { key: 'address', label: 'Alamat Lengkap', type: 'text', placeholder: 'Untuk pengiriman / pickup' },
              { key: 'pickupDate', label: 'Tanggal Pickup / Kirim', type: 'date', placeholder: '' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#5C3D2E' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  min={field.key === 'pickupDate' ? minDateStr : undefined}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(212, 149, 106, 0.25)',
                    color: '#5C3D2E',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#D4956A')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(212, 149, 106, 0.25)')}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#5C3D2E' }}>
                Catatan (Opsional)
              </label>
              <textarea
                placeholder="Permintaan khusus, desain, tulisan di kue, dll"
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(212, 149, 106, 0.25)',
                  color: '#5C3D2E',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4956A')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(212, 149, 106, 0.25)')}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || cart.length === 0}
              className="w-full py-4 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #D4956A 0%, #C1806B 100%)' }}
            >
              {submitting ? '⏳ Mengirim...' : `🛍️ Pesan Sekarang${total > 0 ? ` · ${formatPrice(total)}` : ''}`}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
