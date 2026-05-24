'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { type Product } from '@/lib/store'
import * as db from '@/lib/supabase/db'
import { DashboardShell, DashboardHeader } from '@/components/dashboard/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Package,
  Loader2,
  Upload,
  Image as ImageIcon,
} from 'lucide-react'

function ProductForm({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product?: Product
  onSave: (data: Omit<Product, 'id'>) => Promise<void>
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    image: product?.image || '',
    category: product?.category || 'single' as const,
    isAvailable: product?.isAvailable ?? true,
  })
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, image: e.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...formData,
        price: parseInt(formData.price) || 0,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border sticky top-0 bg-card z-10">
          <CardTitle className="text-foreground">
            {product ? 'Edit Produk' : 'Tambah Produk Baru'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload — at the top */}
            <div className="space-y-2">
              <Label>Foto Produk</Label>
              {formData.image ? (
                <div className="relative group rounded-xl overflow-hidden border border-border">
                  <img
                    src={formData.image}
                    alt="Preview produk"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-white text-foreground"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload size={14} className="mr-1" /> Ganti Foto
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-white text-destructive"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                    >
                      <X size={14} className="mr-1" /> Hapus
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ImageIcon size={32} />
                  <span className="text-sm font-medium">Klik untuk upload foto produk</span>
                  <span className="text-xs">PNG, JPG. Maks 5MB</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageFile(file)
                  e.target.value = ''
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Classic MisuBliss"
                required
                className="bg-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi lengkap produk"
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-border bg-input text-foreground resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="45000"
                  required
                  className="bg-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'single' | 'bundle' })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-input text-foreground"
                >
                  <option value="single">Single</option>
                  <option value="bundle">Bundle</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="isAvailable" className="cursor-pointer">Tersedia</Label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground">
                {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                {product ? 'Simpan Perubahan' : 'Tambah Produk'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  const fetchProducts = useCallback(async () => {
    try {
      const data = await db.getProducts()
      setProducts(data.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
        isAvailable: p.is_available,
      })))
    } catch (err) {
      console.error('Gagal memuat produk:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return
    try {
      await db.deleteProduct(id)
      fetchProducts()
    } catch (err) {
      console.error('Gagal menghapus produk:', err)
    }
  }

  const handleSave = async (data: Omit<Product, 'id'>) => {
    const payload = {
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      category: data.category,
      is_available: data.isAvailable,
    }
    if (editingProduct) {
      await db.updateProduct(editingProduct.id, payload)
    } else {
      await db.addProduct(payload)
    }
    setShowForm(false)
    setEditingProduct(undefined)
    fetchProducts()
  }

  return (
    <DashboardShell>
      <DashboardHeader
        title="Produk"
        description="Kelola menu dan produk yang tersedia"
      />

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => { setEditingProduct(undefined); setShowForm(true) }}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus size={18} className="mr-2" />
          Tambah Produk
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 size={32} className="animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada produk. Tambahkan produk pertama Anda!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Foto</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Produk</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Kategori</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Harga</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.category === 'bundle' 
                            ? 'bg-secondary/20 text-secondary' 
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {product.category === 'bundle' ? 'Bundle' : 'Single'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-foreground">{formatPrice(product.price)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.isAvailable 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.isAvailable ? 'Tersedia' : 'Habis'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingProduct(undefined)
          }}
        />
      )}
    </DashboardShell>
  )
}
