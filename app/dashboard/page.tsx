'use client'

import { useState, useEffect, useCallback } from 'react'
import * as db from '@/lib/supabase/db'
import { DashboardShell, DashboardHeader } from '@/components/dashboard/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, DollarSign, TrendingUp, Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        db.getProducts(),
        db.getOrders(),
      ])
      setProducts(productsData)
      setOrders(ordersData.map((o: any) => ({
        id: o.id,
        customerName: o.customer_name,
        phone: o.phone,
        items: o.items,
        pickupDate: o.pickup_date,
        status: o.status,
        totalAmount: o.total_amount,
        createdAt: o.created_at,
      })))
    } catch (err) {
      console.error('Gagal memuat data dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalProducts = products.length
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
  const totalRevenue = orders
    .filter((o: any) => o.status === 'completed')
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const stats = [
    {
      title: 'Total Produk',
      value: totalProducts,
      icon: Package,
      description: 'Produk aktif',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Pesanan',
      value: totalOrders,
      icon: ShoppingCart,
      description: `${pendingOrders} menunggu konfirmasi`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Pendapatan',
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      description: 'Dari pesanan selesai',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pesanan Pending',
      value: pendingOrders,
      icon: TrendingUp,
      description: 'Perlu diproses',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  const recentOrders = orders.slice(0, 5)

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
        title="Dashboard" 
        description="Selamat datang di CMS MisuBliss. Kelola bisnis tiramisu Anda dari sini."
      />

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={stat.color} size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Orders */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada pesanan</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Pelanggan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Pesanan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {order.items.map((item: any) => `${item.productName} x${item.quantity}`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">{formatPrice(order.totalAmount)}</td>
                      <td className="py-3 px-4">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
