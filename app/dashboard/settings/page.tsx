'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  Loader2,
  Upload,
  Layout,
  Info,
} from 'lucide-react'

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  )
}

// Reusable image uploader component
function ImageUploader({
  label,
  value,
  onChange,
  onRemove,
  placeholder = 'Pilih gambar...',
  previewClass = 'w-full h-40 object-cover rounded-lg',
}: {
  label?: string
  value: string
  onChange: (url: string) => void
  onRemove?: () => void
  placeholder?: string
  previewClass?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = (file: File) => {
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      onChange(dataUrl)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {value ? (
        <div className="relative group">
          <img src={value} alt="Preview" className={previewClass} style={{ objectFit: 'cover' }} />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white text-foreground"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={14} className="mr-1" /> Ganti
            </Button>
            {onRemove && (
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-destructive"
                onClick={onRemove}
              >
                <Trash2 size={14} className="mr-1" /> Hapus
              </Button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm">{placeholder}</span>
            </>
          )}
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
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
    // Hero
    heroTitle: '',
    heroSubtitle: '',
    heroImageUrl: '',
    // About
    aboutTitle: '',
    aboutDescription: '',
    aboutImageUrl: '',
    // About cards (stored as JSON string in about_cards_json field)
    aboutCards: [
      { icon: '🥚', title: 'Bahan Segar', desc: 'Dipilih setiap hari dari supplier terpercaya' },
      { icon: '❤️', title: 'Dibuat dengan Cinta', desc: 'Setiap kue dikerjakan dengan detail dan dedikasi' },
      { icon: '🎨', title: 'Desain Custom', desc: 'Bisa disesuaikan dengan tema dan keinginan Anda' },
      { icon: '🚚', title: 'Pengiriman Aman', desc: 'Dikemas khusus agar tiba dalam kondisi sempurna' },
    ] as { icon: string; title: string; desc: string }[],
  })
  const [serviceAreas, setServiceAreas] = useState<string[]>([])
  const [newArea, setNewArea] = useState('')

  const [bundles, setBundles] = useState<Bundle[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  // Bundle form state
  const [showBundleForm, setShowBundleForm] = useState(false)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [bundleForm, setBundleForm] = useState({
    name: '', description: '', price: 0, originalPrice: 0, items: '', image: '',
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
        let aboutCards = formData.aboutCards
        try {
          if ((settingsData as any).about_cards_json) {
            aboutCards = JSON.parse((settingsData as any).about_cards_json)
          }
        } catch {}
        setFormData({
          storeName: settingsData.store_name || '',
          tagline: settingsData.tagline || '',
          whatsappNumber: settingsData.whatsapp_number || '',
          address: settingsData.address || '',
          logoUrl: settingsData.logo_url || '',
          instagramUrl: settingsData.instagram_url || '',
          tiktokUrl: settingsData.tiktok_url || '',
          heroTitle: (settingsData as any).hero_title || '',
          heroSubtitle: (settingsData as any).hero_subtitle || '',
          heroImageUrl: (settingsData as any).hero_image_url || '',
          aboutTitle: (settingsData as any).about_title || '',
          aboutDescription: (settingsData as any).about_description || '',
          aboutImageUrl: (settingsData as any).about_image_url || '',
          aboutCards,
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

  useEffect(() => { fetchAll() }, [fetchAll])

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
        hero_title: formData.heroTitle,
        hero_subtitle: formData.heroSubtitle,
        hero_image_url: formData.heroImageUrl,
        about_title: formData.aboutTitle,
        about_description: formData.aboutDescription,
        about_image_url: formData.aboutImageUrl,
        about_cards_json: JSON.stringify(formData.aboutCards),
        service_areas: serviceAreas,
      } as any)
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
        image: bundle.image || '',
      })
    } else {
      setEditingBundle(null)
      setBundleForm({ name: '', description: '', price: 0, originalPrice: 0, items: '', image: '' })
    }
    setShowBundleForm(true)
  }

  const handleSaveBundle = async () => {
    const payload = {
      name: bundleForm.name,
      description: bundleForm.description,
      price: bundleForm.price,
      original_price: bundleForm.originalPrice,
      image: bundleForm.image || '/products/bundle.jpg',
      items: bundleForm.items.split('\n').filter(Boolean),
      is_available: true,
    }
    if (editingBundle) {
      await db.updateBundle(editingBundle.id, payload)
    } else {
      await db.addBundle(payload)
    }
    setShowBundleForm(false)
    setBundleForm({ name: '', description: '', price: 0, originalPrice: 0, items: '', image: '' })
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

  const updateAboutCard = (index: number, field: 'icon' | 'title' | 'desc', value: string) => {
    const cards = [...formData.aboutCards]
    cards[index] = { ...cards[index], [field]: value }
    setFormData({ ...formData, aboutCards: cards })
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

  const logoFileRef = useRef<HTMLInputElement>(null)

  return (
    <DashboardShell>
      <DashboardHeader 
        title="Pengaturan" 
        description="Kelola profil toko, hero, tentang kami, bundle, dan testimoni"
      />

      <div className="grid gap-6">
        {/* ── Store Profile ── */}
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
            
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Logo Toko</Label>
              <div className="flex items-center gap-4">
                {formData.logoUrl ? (
                  <div className="relative group">
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      className="w-20 h-20 object-contain rounded-xl border border-border bg-muted"
                    />
                    <button
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={28} />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                          setFormData({ ...formData, logoUrl: ev.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                      input.click()
                    }}
                  >
                    <Upload size={14} className="mr-1" />
                    {formData.logoUrl ? 'Ganti Logo' : 'Upload Logo'}
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG, SVG. Maks 2MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Hero Section ── */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Layout size={20} />
              Hero Section (Landing Page)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Judul Hero</Label>
                <Input
                  id="heroTitle"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Kue Cantik, Rasa Istimewa"
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Subjudul Hero</Label>
                <Input
                  id="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Dibuat dengan bahan pilihan dan penuh cinta..."
                  className="bg-input"
                />
              </div>
            </div>
            <ImageUploader
              label="Foto Hero"
              value={formData.heroImageUrl}
              onChange={(url) => setFormData({ ...formData, heroImageUrl: url })}
              onRemove={() => setFormData({ ...formData, heroImageUrl: '' })}
              placeholder="Upload foto untuk ditampilkan di hero section"
              previewClass="w-full h-52 object-cover rounded-lg"
            />
            {formData.heroImageUrl && (
              <p className="text-xs text-muted-foreground">
                ✓ Foto hero akan langsung tampil di landing page setelah disimpan.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── About Section ── */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Info size={20} />
              Tentang Kami (Landing Page)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="aboutTitle">Judul Tentang Kami</Label>
              <Input
                id="aboutTitle"
                value={formData.aboutTitle}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                placeholder="Kue Buatan Rumah yang Penuh Cinta"
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutDescription">Deskripsi</Label>
              <textarea
                id="aboutDescription"
                value={formData.aboutDescription}
                onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                placeholder="Ceritakan tentang toko Anda..."
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-border bg-input text-foreground resize-none"
                rows={4}
              />
            </div>
            <ImageUploader
              label="Foto Tentang Kami"
              value={formData.aboutImageUrl}
              onChange={(url) => setFormData({ ...formData, aboutImageUrl: url })}
              onRemove={() => setFormData({ ...formData, aboutImageUrl: '' })}
              placeholder="Upload foto untuk bagian Tentang Kami"
              previewClass="w-full h-52 object-cover rounded-lg"
            />

            {/* About feature cards */}
            <div className="space-y-3">
              <Label>Card Fitur (4 card di bagian Tentang Kami)</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {formData.aboutCards.map((card, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        value={card.icon}
                        onChange={(e) => updateAboutCard(i, 'icon', e.target.value)}
                        placeholder="🥚"
                        className="bg-input w-16 text-center text-lg"
                        maxLength={4}
                      />
                      <Input
                        value={card.title}
                        onChange={(e) => updateAboutCard(i, 'title', e.target.value)}
                        placeholder="Judul card"
                        className="bg-input flex-1"
                      />
                    </div>
                    <Input
                      value={card.desc}
                      onChange={(e) => updateAboutCard(i, 'desc', e.target.value)}
                      placeholder="Deskripsi singkat..."
                      className="bg-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Contact Info ── */}
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

        {/* ── Service Areas ── */}
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

        {/* ── Bundle Management ── */}
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
                    <div className="flex items-center gap-3">
                      {bundle.image && (
                        <img src={bundle.image} alt={bundle.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{bundle.name}</p>
                        <p className="text-sm text-muted-foreground">{bundle.description}</p>
                        <p className="text-sm text-primary font-semibold mt-1">
                          Rp {bundle.price.toLocaleString('id-ID')}
                        </p>
                      </div>
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

        {/* ── Testimonial Management ── */}
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
          <Card className="w-full max-w-lg bg-card max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border sticky top-0 bg-card z-10">
              <CardTitle>{editingBundle ? 'Edit Bundle' : 'Tambah Bundle'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowBundleForm(false)}>
                <X size={20} />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Image upload for bundle */}
              <ImageUploader
                label="Foto Bundle"
                value={bundleForm.image}
                onChange={(url) => setBundleForm({ ...bundleForm, image: url })}
                onRemove={() => setBundleForm({ ...bundleForm, image: '' })}
                placeholder="Upload foto bundle"
                previewClass="w-full h-40 object-cover rounded-lg"
              />
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
          <Card className="w-full max-w-lg bg-card max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border sticky top-0 bg-card z-10">
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
              <ImageUploader
                label="Foto Pelanggan (opsional)"
                value={testimonialForm.image}
                onChange={(url) => setTestimonialForm({ ...testimonialForm, image: url })}
                onRemove={() => setTestimonialForm({ ...testimonialForm, image: '' })}
                placeholder="Upload foto pelanggan"
                previewClass="w-24 h-24 rounded-full object-cover"
              />
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
