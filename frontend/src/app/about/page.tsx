'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80"
          alt="About NEUVE"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-transparent" />
        <div className="container-luxury relative z-10 pb-12 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">The Brand</p>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">
              About NEUVE
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-32">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-6">
                Where Art Meets
                <br />
                <span className="italic font-light text-white/60">Intentional Design</span>
              </h2>
              <div className="space-y-4 text-sm text-white/40 leading-relaxed">
                <p>
                  NEUVE is an independent fashion brand inspired by the art, science and minimalism.
                  Founded with a vision to bridge the gap between high fashion and accessible luxury,
                  we create pieces that speak to the modern individual.
                </p>
                <p>
                  Every collection is a study in form and function — carefully considered silhouettes,
                  premium materials, and timeless design principles that transcend seasonal trends.
                </p>
                <p>
                  Before this project, all sales happened manually through Instagram DMs. We built this
                  platform to reflect our aesthetic and automate the shopping experience, allowing our
                  community to engage with NEUVE on their own terms.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
                alt="NEUVE Story"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-primary-900/30">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Our Philosophy</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter">
              Built on Intention
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Minimal by Design',
                description: 'Every element serves a purpose. We strip away the unnecessary to reveal the essential beauty in form.',
              },
              {
                title: 'Quality Over Quantity',
                description: 'We produce in limited quantities using premium materials. Each piece is an investment in lasting style.',
              },
              {
                title: 'Conscious Creation',
                description: 'Sustainability is woven into our process. From sourcing to packaging, we consider our environmental impact.',
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="border border-white/5 p-8"
              >
                <span className="text-5xl font-display font-bold text-white/5">0{i + 1}</span>
                <h3 className="text-lg font-display font-bold mt-4 mb-3">{value.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="container-luxury text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-6">
              Experience the Collection
            </h2>
            <p className="text-sm text-white/40 max-w-md mx-auto mb-8">
              Discover pieces designed to become the foundation of your personal style.
            </p>
            <Link href="/shop" className="btn-primary">
              Shop Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
