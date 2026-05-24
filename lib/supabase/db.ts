import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// ===== PRODUCTS =====
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id: string, product: any) {
  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
  if (error) throw error
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ===== ORDERS =====
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addOrder(order: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteOrder(id: string) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ===== BUNDLES =====
export async function getBundles() {
  const { data, error } = await supabase
    .from('bundles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addBundle(bundle: any) {
  const { data, error } = await supabase
    .from('bundles')
    .insert([bundle])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateBundle(id: string, bundle: any) {
  const { error } = await supabase
    .from('bundles')
    .update(bundle)
    .eq('id', id)
  if (error) throw error
}

export async function deleteBundle(id: string) {
  const { error } = await supabase
    .from('bundles')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ===== TESTIMONIALS =====
export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addTestimonial(testimonial: any) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonial])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTestimonial(id: string, testimonial: any) {
  const { error } = await supabase
    .from('testimonials')
    .update(testimonial)
    .eq('id', id)
  if (error) throw error
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ===== SETTINGS =====
export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) throw error
  return data
}

export async function updateSettings(settings: any) {
  const { error } = await supabase
    .from('settings')
    .update(settings)
    .eq('id', 1)
  if (error) throw error
}

// ===== NAV ITEMS =====
export async function getNavItems() {
  const { data, error } = await supabase
    .from('nav_items')
    .select('*')
    .order('order_index', { ascending: true })
  if (error) throw error
  return data
}

export async function addNavItem(item: any) {
  const { data, error } = await supabase
    .from('nav_items')
    .insert([item])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateNavItem(id: string, item: any) {
  const { error } = await supabase
    .from('nav_items')
    .update(item)
    .eq('id', id)
  if (error) throw error
}

export async function deleteNavItem(id: string) {
  const { error } = await supabase
    .from('nav_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}