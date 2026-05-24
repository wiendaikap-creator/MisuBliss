import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - MisuBliss CMS',
  description: 'Kelola produk, pesanan, dan pengaturan toko MisuBliss',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
