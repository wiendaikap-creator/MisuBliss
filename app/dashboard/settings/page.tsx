'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Bundle, type Testimonial } from '@/lib/store'
import * as db from '@/lib/supabase/db'
import { DashboardShell, DashboardHeader } from '@/components/dashboard/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Store,
  MapPin,
  Phone,
  Save,
  Plus,
  X,
  Image as ImageIcon,
  Gift,
  Star,
  Pencil,
  Trash2,
  Instagram,
  Loader2
} from 'lucide-react'

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  )
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [formData, setFormData] = useState({
    storeName: '',
    tagline: '',
    whatsappNumber: '',
    address: '',
    logoUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
  })
  const [serviceAreas, setServiceAreas] = useState<string[]>([])
  const [newArea, setNewArea] = useState('')

  const [bundles, setBundles] = useState<Bundle[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  // Bundle form state
  const [showBundleForm, setShowBundleForm] = useState(false)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [bundleForm, setBundleForm] = useState({
    name: '', description: '', price: 0, originalPrice: 0, items: '',
  })

  // Testimonial form state
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [testimonialForm, setTestimonialForm] = useState({
    name: '', comment: '', image: '', rating: 5,
  })

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [settingsData, bundlesData, testimonialsData] = await Promise.all([
        db.getSettings(),
        db.getBundles(),
        db.getTestimonials(),
      ])
      if (settingsData) {
        setFormData({
          storeName: settingsData.store_name || '',
          tagline: settingsData.tagline || '',
          whatsappNumber: settingsData.whatsapp_number || '',
          address: settingsData.address || '',
          logoUrl: settingsData.logo_url || '',
          instagramUrl: settingsData.instagram_url || '',
          tiktokUrl: settingsData.tiktok_url || '',
        })
        setServiceAreas(settingsData.service_areas || [])
      }
      setBundles(bundlesData.map((b: any) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        price: b.price,
        originalPrice: b.original_price,
        image: b.image,
        items: b.items,
        isAvailable: b.is_available,
      })))
      setTestimonials(testimonialsData.map((t: any) => ({
        id: t.id,
        name: t.name,
        comment: t.comment,
        image: t.image,
        rating: t.rating,
      })))
    } catch (err) {
      console.error('Gagal memuat settings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleAddArea = () => {
    if (newArea.trim() && !serviceAreas.includes(newArea.trim())) {
      setServiceAreas([...serviceAreas, newArea.trim()])
      setNewArea('')
    }
  }

  const handleRemoveArea = (area: string) => {
    setServiceAreas(serviceAreas.filter((a) => a !== area))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await db.updateSettings({
        store_name: formData.storeName,
        tagline: formData.tagline,
        whatsapp_number: formData.whatsappNumber,
        address: formData.address,
        logo_url: formData.logoUrl,
        instagram_url: formData.instagramUrl,
        tiktok_url: formData.tiktokUrl,
        service_areas: serviceAreas,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Gagal menyimpan settings:', err)
    } finally {
      setSaving(false)
    }
  }

  // Bundle handlers
  const handleOpenBundleForm = (bundle?: Bundle) => {
    if (bundle) {
      setEditingBundle(bundle)
      setBundleForm({
        name: bundle.name,
        description: bundle.description,
        price: bundle.price,
        originalPrice: bundle.originalPrice,
        items: bundle.items.join('\n'),
      })
    } else {
      setEditingBundle(null)
      setBundleForm({ name: '', description: '', price: 0, originalPrice: 0, items: '' })
    }
    setShowBundleForm(true)
  }

  const handleSaveBundle = async () => {
    const payload = {
      name: bundleForm.name,
      description: bundleForm.description,
      price: bundleForm.price,
      original_price: bundleForm.originalPrice,
      image: '/products/bundle.jpg',
      items: bundleForm.items.split('\n').filter(Boolean),
      is_available: true,
    }
    if (editingBundle) {
      await db.updateBundle(editingBundle.id, payload)
    } else {
      await db.addBundle(payload)
    }
    setShowBundleForm(false)
    setBundleForm({ name: '', description: '', price: 0, originalPrice: 0, items: '' })
    setEditingBundle(null)
    fetchAll()
  }

  const handleDeleteBundle = async (id: string) => {
    if (confirm('Hapus bundle ini?')) {
      await db.deleteBundle(id)
      fetchAll()
    }
  }

  // Testimonial handlers
  const handleOpenTestimonialForm = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setTestimonialForm({
        name: testimonial.name,
        comment: testimonial.comment,
        image: testimonial.image,
        rating: testimonial.rating,
      })
    } else {
      setEditingTestimonial(null)
      setTestimonialForm({ name: '', comment: '', image: '', rating: 5 })
    }
    setShowTestimonialForm(true)
  }

  const handleSaveTestimonial = async () => {
    const payload = {
      name: testimonialForm.name,
      comment: testimonialForm.comment,
      image: testimonialForm.image,
      rating: testimonialForm.rating,
    }
    if (editingTestimonial) {
      await db.updateTestimonial(editingTestimonial.id, payload)
    } else {
      await db.addTestimonial(payload)
    }
    setShowTestimonialForm(false)
    setTestimonialForm({ name: '', comment: '', image: '', rating: 5 })
    setEditingTestimonial(null)
    fetchAll()
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Hapus testimoni ini?')) {
      await db.deleteTestimonial(id)
      fetchAll()
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center py-24">
          <Loader2 size={40} className="animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader 
        title="Pengaturan" 
        description="Kelola profil toko, bundle, dan testimoni"
      />

      <div className="grid gap-6">
        {/* Store Profile */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Store size={20} />
              Profil Toko
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nama Toko</Label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="MisuBliss"
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="a spoonful of bliss"
                  className="bg-input"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL Logo</Label>
              <div className="flex gap-2">
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="/logo.png"
                  className="bg-input"
                />
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <ImageIcon size={18} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Phone size={20} />
              Kontak & Alamat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="6281234567890"
                className="bg-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Tiramisu No. 123, Kota Malang"
                className="bg-input"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                  <Instagram size={16} /> URL Instagram
                </Label>
                <Input
                  id="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/misubliss"
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktokUrl" className="flex items-center gap-2">
                  <TikTokIcon size={16} /> URL TikTok
                </Label>
                <Input
                  id="tiktokUrl"
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@misubliss"
                  className="bg-input"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <MapPin size={20} />
              Area Layanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Tambah area layanan"
                className="bg-input"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArea())}
              />
              <Button onClick={handleAddArea} variant="outline">
                <Plus size={18} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {area}
                  <button
                    onClick={() => handleRemoveArea(area)}
                    className="ml-1 hover:text-destructive transition-colors"
                    aria-label={`Remove ${area}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bundle Management */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Gift size={20} />
              Kelola Bundle
            </CardTitle>
            <Button onClick={() => handleOpenBundleForm()} size="sm" className="bg-primary text-primary-foreground">
              <Plus size={16} className="mr-1" /> Tambah Bundle
            </Button>
          </CardHeader>
          <CardContent>
            {bundles.length === 0 ? (
              <p className="text-muted-foreground text-sm">Belum ada bundle. Tambahkan bundle baru.</p>
            ) : (
              <div className="space-y-3">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{bundle.name}</p>
                      <p className="text-sm text-muted-foreground">{bundle.description}</p>
                      <p className="text-sm text-primary font-semibold mt-1">
                        Rp {bundle.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenBundleForm(bundle)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDeleteBundle(bundle.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Testimonial Management */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Star size={20} />
              Kelola Testimoni
            </CardTitle>
            <Button onClick={() => handleOpenTestimonialForm()} size="sm" className="bg-primary text-primary-foreground">
              <Plus size={16} className="mr-1" /> Tambah Testimoni
            </Button>
          </CardHeader>
          <CardContent>
            {testimonials.length === 0 ? (
              <p className="text-muted-foreground text-sm">Belum ada testimoni. Tambahkan testimoni baru.</p>
            ) : (
              <div className="space-y-3">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <span className="text-primary font-bold">{testimonial.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{testimonial.comment}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenTestimonialForm(testimonial)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
            {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>

      {/* Bundle Form Modal */}
      {showBundleForm && (
        <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
              <CardTitle>{editingBundle ? 'Edit Bundle' : 'Tambah Bundle'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowBundleForm(false)}>
                <X size={20} />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Nama Bundle</Label>
                <Input
                  value={bundleForm.name}
                  onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                  placeholder="Bundle Trio Bliss"
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input
                  value={bundleForm.description}
                  onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                  placeholder="Paket hemat berisi..."
                  className="bg-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Harga Asli</Label>
                  <Input
                    type="number"
                    value={bundleForm.originalPrice}
                    onChange={(e) => setBundleForm({ ...bundleForm, originalPrice: Number(e.target.value) })}
                    placeholder="150000"
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Harga Bundle</Label>
                  <Input
                    type="number"
                    value={bundleForm.price}
                    onChange={(e) => setBundleForm({ ...bundleForm, price: Number(e.target.value) })}
                    placeholder="135000"
                    className="bg-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Item Bundle (satu per baris)</Label>
                <textarea
                  value={bundleForm.items}
                  onChange={(e) => setBundleForm({ ...bundleForm, items: e.target.value })}
                  placeholder={"Classic MisuBliss (1 cup)\nChoco MisuBliss (1 cup)\nMatcha MisuBliss (1 cup)"}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowBundleForm(false)}>Batal</Button>
                <Button onClick={handleSaveBundle} className="bg-primary text-primary-foreground">
                  {editingBundle ? 'Simpan' : 'Tambah'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Testimonial Form Modal */}
      {showTestimonialForm && (
        <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
              <CardTitle>{editingTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowTestimonialForm(false)}>
                <X size={20} />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Nama Pelanggan</Label>
                <Input
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  placeholder="Sarah Putri"
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label>URL Foto (opsional)</Label>
                <Input
                  value={testimonialForm.image}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                  placeholder="/testimonials/sarah.jpg"
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Komentar</Label>
                <textarea
                  value={testimonialForm.comment}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, comment: e.target.value })}
                  placeholder="Tiramisu paling enak yang pernah saya coba..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating })}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={rating <= testimonialForm.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowTestimonialForm(false)}>Batal</Button>
                <Button onClick={handleSaveTestimonial} className="bg-primary text-primary-foreground">
                  {editingTestimonial ? 'Simpan' : 'Tambah'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  )
}
