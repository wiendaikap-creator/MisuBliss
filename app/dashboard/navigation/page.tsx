'use client'

import { useState, useEffect, useCallback } from 'react'
import { type NavItem } from '@/lib/store'
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
  Navigation,
  GripVertical,
  Loader2
} from 'lucide-react'

function NavItemForm({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item?: NavItem
  onSave: (data: Omit<NavItem, 'id'>) => Promise<void>
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    label: item?.label || '',
    href: item?.href || '#',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle className="text-foreground">
            {item ? 'Edit Menu Navigasi' : 'Tambah Menu Navigasi'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label Menu</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Contoh: Tentang Kami"
                required
                className="bg-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="href">Link / Anchor</Label>
              <Input
                id="href"
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                placeholder="Contoh: #about atau /about"
                required
                className="bg-input"
              />
              <p className="text-xs text-muted-foreground">
                Gunakan # untuk anchor (contoh: #menu) atau / untuk halaman (contoh: /about)
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground">
                {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                {item ? 'Simpan Perubahan' : 'Tambah Menu'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NavigationPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<NavItem | undefined>()

  const fetchNavItems = useCallback(async () => {
    try {
      const data = await db.getNavItems()
      setNavItems(data.map((n: any) => ({
        id: n.id,
        label: n.label,
        href: n.href,
      })))
    } catch (err) {
      console.error('Gagal memuat nav items:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNavItems()
  }, [fetchNavItems])

  const handleSave = async (data: Omit<NavItem, 'id'>) => {
    const payload = {
      label: data.label,
      href: data.href,
      order_index: editingItem ? undefined : navItems.length + 1,
    }
    if (editingItem) {
      await db.updateNavItem(editingItem.id, payload)
    } else {
      await db.addNavItem(payload)
    }
    setShowForm(false)
    setEditingItem(undefined)
    fetchNavItems()
  }

  const handleEdit = (item: NavItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus menu navigasi ini?')) {
      await db.deleteNavItem(id)
      fetchNavItems()
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <DashboardHeader 
          title="Kelola Navigasi" 
          description="Tambah, edit, atau hapus menu navigasi landing page"
        />
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus size={18} className="mr-2" />
          Tambah Menu
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Navigation size={20} />
            Menu Navigasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={32} className="animate-spin text-muted-foreground" />
            </div>
          ) : navItems.length === 0 ? (
            <div className="text-center py-8">
              <Navigation size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada menu navigasi</p>
            </div>
          ) : (
            <div className="space-y-2">
              {navItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 bg-muted rounded-xl group hover:bg-muted/80"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical size={20} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.href}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(item)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border mt-6">
        <CardHeader>
          <CardTitle className="text-foreground text-sm">Preview Navigasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 p-4 bg-card border border-border rounded-xl">
            {navItems.map((item) => (
              <span 
                key={item.id}
                className="text-foreground/80 hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {item.label}
              </span>
            ))}
            <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-medium text-sm cursor-pointer">
              Pesan Sekarang
            </span>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <NavItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingItem(undefined)
          }}
        />
      )}
    </DashboardShell>
  )
}
