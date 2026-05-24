import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'single' | 'bundle'
  isAvailable: boolean
}

export interface Bundle {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  items: string[]
  isAvailable: boolean
}

export interface Testimonial {
  id: string
  name: string
  comment: string
  image: string
  rating: number
}

export interface Order {
  id: string
  customerName: string
  address: string
  phone: string
  items: { productId: string; productName: string; quantity: number; price: number }[]
  pickupDate: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  totalAmount: number
  createdAt: string
}

export interface NavItem {
  id: string
  label: string
  href: string
}

export interface StoreSettings {
  storeName: string
  tagline: string
  whatsappNumber: string
  address: string
  serviceAreas: string[]
  logoUrl: string
  instagramUrl: string
  tiktokUrl: string
}

interface StoreState {
  products: Product[]
  bundles: Bundle[]
  testimonials: Testimonial[]
  orders: Order[]
  navItems: NavItem[]
  settings: StoreSettings
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addBundle: (bundle: Omit<Bundle, 'id'>) => void
  updateBundle: (id: string, bundle: Partial<Bundle>) => void
  deleteBundle: (id: string) => void
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void
  deleteTestimonial: (id: string) => void
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
  deleteOrder: (id: string) => void
  addNavItem: (item: Omit<NavItem, 'id'>) => void
  updateNavItem: (id: string, item: Partial<NavItem>) => void
  deleteNavItem: (id: string) => void
  updateSettings: (settings: Partial<StoreSettings>) => void
}

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Classic MisuBliss',
    description: 'Tiramisu klasik dengan rasa kopi yang kaya dan mascarpone yang lembut',
    price: 45000,
    image: '/products/classic.jpg',
    category: 'single',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Choco MisuBliss',
    description: 'Perpaduan cokelat premium dengan kelembutan tiramisu yang memanjakan',
    price: 50000,
    image: '/products/choco.jpg',
    category: 'single',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Matcha MisuBliss',
    description: 'Sentuhan matcha Jepang yang menyegarkan dalam tiramisu lembut',
    price: 55000,
    image: '/products/matcha.jpg',
    category: 'single',
    isAvailable: true,
  },
]

const defaultBundles: Bundle[] = [
  {
    id: '1',
    name: 'Bundle Trio Bliss',
    description: 'Paket hemat berisi 3 varian: Classic, Choco, dan Matcha MisuBliss',
    price: 135000,
    originalPrice: 150000,
    image: '/products/bundle.jpg',
    items: ['Classic MisuBliss (1 cup)', 'Choco MisuBliss (1 cup)', 'Matcha MisuBliss (1 cup)', 'Hemat hingga Rp 15.000', 'Packaging eksklusif'],
    isAvailable: true,
  },
]

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Putri',
    comment: 'Tiramisu paling enak yang pernah saya coba di Malang! Teksturnya lembut dan rasanya pas banget.',
    image: '/testimonials/sarah.jpg',
    rating: 5,
  },
  {
    id: '2',
    name: 'Budi Santoso',
    comment: 'Matcha MisuBliss nya juara! Seger dan nggak terlalu manis. Pasti repeat order lagi.',
    image: '/testimonials/budi.jpg',
    rating: 5,
  },
  {
    id: '3',
    name: 'Dina Rahayu',
    comment: 'Packaging cantik, cocok banget buat hadiah. Rasa Choco nya bikin nagih!',
    image: '/testimonials/dina.jpg',
    rating: 5,
  },
]

const defaultNavItems: NavItem[] = [
  { id: '1', label: 'Beranda', href: '#hero' },
  { id: '2', label: 'Menu', href: '#menu' },
  { id: '3', label: 'Bundle', href: '#bundle' },
  { id: '4', label: 'Testimoni', href: '#testimonials' },
  { id: '5', label: 'Lokasi', href: '#location' },
]

const defaultSettings: StoreSettings = {
  storeName: 'MisuBliss',
  tagline: 'a spoonful of bliss',
  whatsappNumber: '6281234567890',
  address: 'Jl. Tiramisu No. 123, Lowokwaru, Kota Malang, Jawa Timur 65141',
  serviceAreas: ['Kota Malang', 'Lowokwaru', 'Klojen', 'Blimbing', 'Kedungkandang', 'Sukun'],
  logoUrl: '/logo.png',
  instagramUrl: 'https://instagram.com/misubliss',
  tiktokUrl: 'https://tiktok.com/@misubliss',
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: defaultProducts,
      bundles: defaultBundles,
      testimonials: defaultTestimonials,
      orders: [],
      navItems: defaultNavItems,
      settings: defaultSettings,
      
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now().toString() }],
        })),
      
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        })),
      
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addBundle: (bundle) =>
        set((state) => ({
          bundles: [...state.bundles, { ...bundle, id: Date.now().toString() }],
        })),
      
      updateBundle: (id, bundle) =>
        set((state) => ({
          bundles: state.bundles.map((b) =>
            b.id === id ? { ...b, ...bundle } : b
          ),
        })),
      
      deleteBundle: (id) =>
        set((state) => ({
          bundles: state.bundles.filter((b) => b.id !== id),
        })),

      addTestimonial: (testimonial) =>
        set((state) => ({
          testimonials: [...state.testimonials, { ...testimonial, id: Date.now().toString() }],
        })),
      
      updateTestimonial: (id, testimonial) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, ...testimonial } : t
          ),
        })),
      
      deleteTestimonial: (id) =>
        set((state) => ({
          testimonials: state.testimonials.filter((t) => t.id !== id),
        })),
      
      addOrder: (order) =>
        set((state) => ({
          orders: [
            ...state.orders,
            { ...order, id: Date.now().toString(), createdAt: new Date().toISOString() },
          ],
        })),
      
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        })),
      
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),
      
      addNavItem: (item) =>
        set((state) => ({
          navItems: [...state.navItems, { ...item, id: Date.now().toString() }],
        })),
      
      updateNavItem: (id, item) =>
        set((state) => ({
          navItems: state.navItems.map((n) =>
            n.id === id ? { ...n, ...item } : n
          ),
        })),
      
      deleteNavItem: (id) =>
        set((state) => ({
          navItems: state.navItems.filter((n) => n.id !== id),
        })),
      
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: 'misubliss-store',
    }
  )
)
