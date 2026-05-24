'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Order } from '@/lib/store'
import * as db from '@/lib/supabase/db'
import { DashboardShell, DashboardHeader } from '@/components/dashboard/dashboard-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Trash2, 
  ShoppingCart,
  Eye,
  X,
  Calendar,
  MapPin,
  Phone,
  User,
  Loader2
} from 'lucide-react'

function OrderDetail({ order, onClose, onStatusChange }: { order: Order; onClose: () => void; onStatusChange: () => void }) {
  const [updating, setUpdating] = useState(false)

  const handleStatusUpdate = async (status: Order['status']) => {
    setUpdating(true)
    try {
      await db.updateOrderStatus(order.id, status)
      order.status = status
      onStatusChange()
    } finally {
      setUpdating(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Detail Pesanan</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Informasi Pelanggan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <User size={16} className="text-muted-foreground" />
                <span className="text-foreground">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-muted-foreground" />
                <span className="text-foreground">{order.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-muted-foreground mt-0.5" />
                <span className="text-foreground">{order.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-foreground">Pickup: {formatDate(order.pickupDate)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Pesanan</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Update Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => {
                const labels: Record<string, string> = {
                  pending: 'Menunggu',
                  confirmed: 'Dikonfirmasi',
                  completed: 'Selesai',
                  cancelled: 'Dibatalkan',
                }
                const colors: Record<string, string> = {
                  pending: 'bg-orange-500 text-white',
                  confirmed: 'bg-blue-500 text-white',
                  completed: 'bg-green-500 text-white',
                  cancelled: 'bg-red-500 text-white',
                }
                return (
                  <Button
                    key={status}
                    variant={order.status === status ? 'default' : 'outline'}
                    size="sm"
                    disabled={updating}
                    onClick={() => handleStatusUpdate(status)}
                    className={order.status === status ? colors[status] : ''}
                  >
                    {labels[status]}
                  </Button>
                )
              })}
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-primary text-primary-foreground">
            Tutup
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetchOrders = useCallback(async () => {
    try {
      const data = await db.getOrders()
      setOrders(data.map((o: any) => ({
        id: o.id,
        customerName: o.customer_name,
        address: o.address,
        phone: o.phone,
        items: o.items,
        pickupDate: o.pickup_date,
        status: o.status,
        totalAmount: o.total_amount,
        createdAt: o.created_at,
      })))
    } catch (err) {
      console.error('Gagal memuat pesanan:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  )

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      await db.deleteOrder(id)
      fetchOrders()
    }
  }

  const statusFilters = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
  ]

  return (
    <DashboardShell>
      <DashboardHeader 
        title="Kelola Pesanan" 
        description="Lihat dan kelola semua pesanan yang masuk"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={filterStatus === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(filter.value)}
            className={filterStatus === filter.value ? 'bg-primary text-primary-foreground' : ''}
          >
            {filter.label}
            {filter.value !== 'all' && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-foreground/10 text-xs">
                {orders.filter(o => o.status === filter.value).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 size={32} className="animate-spin text-muted-foreground" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {filterStatus === 'all' ? 'Belum ada pesanan' : 'Tidak ada pesanan dengan status ini'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Pelanggan</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Pesanan</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Pickup</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-foreground">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-foreground text-sm">
                        {order.items.map(item => `${item.productName} x${item.quantity}`).join(', ')}
                      </td>
                      <td className="py-4 px-6 text-foreground text-sm">{formatDate(order.pickupDate)}</td>
                      <td className="py-4 px-6 font-medium text-foreground">{formatPrice(order.totalAmount)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status === 'pending' ? 'Menunggu' :
                           order.status === 'confirmed' ? 'Dikonfirmasi' :
                           order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(order.id)}
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

      {selectedOrder && (
        <OrderDetail 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onStatusChange={fetchOrders}
        />
      )}
    </DashboardShell>
  )
}
