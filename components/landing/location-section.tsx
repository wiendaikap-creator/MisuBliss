'use client'

import { useStore } from '@/lib/store'
import { MapPin, Truck, Clock, Phone } from 'lucide-react'

export function LocationSection() {
  const { settings } = useStore()

  return (
    <section id="location" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Lokasi & <span className="text-primary">Pengiriman</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kami melayani pengiriman dan pickup di area Kota Malang dan sekitarnya
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted rounded-2xl">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Alamat Kami</h3>
                <p className="text-muted-foreground">{settings.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted rounded-2xl">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Area Layanan</h3>
                <div className="flex flex-wrap gap-2">
                  {settings.serviceAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted rounded-2xl">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Jam Operasional</h3>
                <p className="text-muted-foreground">Senin - Minggu: 09.00 - 21.00 WIB</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted rounded-2xl">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Hubungi Kami</h3>
                <p className="text-muted-foreground">+{settings.whatsappNumber.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 via-accent to-secondary/10 rounded-3xl p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-card rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <MapPin size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Kota Malang</h3>
              <p className="text-muted-foreground">Jawa Timur, Indonesia</p>
              <p className="text-sm text-primary mt-4 font-medium">
                Pickup & Delivery Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
