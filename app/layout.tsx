import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MisuBliss - Tiramisu Lembut dan Creamy',
  description: 'A spoonful of bliss. Tiramisu premium di Kota Malang dengan rasa lembut dan creamy yang memanjakan lidah Anda.',
  keywords: ['tiramisu', 'malang', 'dessert', 'kue', 'premium', 'misubliss'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${nunito.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
