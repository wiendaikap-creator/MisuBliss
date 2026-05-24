'use client'

import Image from 'next/image'

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tentang Kami
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden shadow-xl mb-8">
            <Image
              src="/images/about-us.jpg"
              alt="Tim MisuBliss sedang membuat tiramisu"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-primary/10">
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
              <span className="text-primary font-semibold">MisuBliss</span> lahir dari passion kami terhadap dessert berkualitas. 
              Dimulai dari dapur rumahan kami, setiap tiramisu dibuat fresh - tanpa pengawet, tanpa kompromi. 
              Kami percaya makanan terbaik datang dari bahan terbaik dan hati yang tulus.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              Nama &ldquo;<span className="text-primary font-semibold">MisuBliss</span>&rdquo; berasal dari kata 
              &ldquo;tiramisu&rdquo; dan &ldquo;bliss&rdquo; (kebahagiaan) - karena itulah yang kami berikan: 
              <span className="text-primary font-medium"> kebahagiaan dalam setiap suapan</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
