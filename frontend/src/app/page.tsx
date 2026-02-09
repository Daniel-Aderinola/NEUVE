'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productAPI, categoryAPI } from '@/lib/api';
import { Product, Category } from '@/lib/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getAll(),
        ]);
        setFeaturedProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80"
            alt="Hero"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-950/60 to-primary-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent" />
        </div>

        <motion.div
          className="container-luxury relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-6">
                New Collection — SS26
              </p>
            </motion.div>

            <motion.h1
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter mb-8"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Beyond
              <br />
              <span className="italic font-light text-white/70">Form</span>
            </motion.h1>

            <motion.p
              className="text-sm md:text-base text-white/50 max-w-md mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Curated fashion for the modern individual. Where minimalism
              meets bold expression in every carefully considered piece.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/shop" className="btn-primary">
                Explore Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/shop?featured=true" className="btn-outline">
                View Lookbook
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <motion.div
            className="w-[1px] h-8 bg-white/20 overflow-hidden"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <motion.div
              className="w-full h-full bg-white/60 origin-top"
              animate={{ y: ['0%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="py-20 md:py-32">
        <div className="container-luxury">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">Curated</p>
              <h2 className="text-heading font-display font-bold tracking-tighter">
                Collections
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {categories.slice(0, 3).map((category, i) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              >
                <Link
                  href={`/shop?category=${category._id}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-primary-900"
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-luxury group-hover:scale-110"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">
                      {category.description}
                    </p>
                    <h3 className="text-lg md:text-xl font-display font-bold tracking-tight">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-20 md:py-32 bg-primary-900/30">
        <div className="container-luxury">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">Selected</p>
              <h2 className="text-heading font-display font-bold tracking-tighter">
                Featured Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
            >
              Shop All
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {featuredProducts.slice(0, 8).map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== EDITORIAL SECTION ==================== */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="container-luxury">
          {/* Large editorial text */}
          <motion.div
            className="mb-16 md:mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.85] text-white/[0.03]">
              NEUVE
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left - Image */}
            <motion.div
              className="relative aspect-[4/5] overflow-hidden"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
                alt="Editorial"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Right - Content */}
            <motion.div
              className="lg:pl-8"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">
                The Editorial
              </p>

              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.95] mb-8">
                In the Motion
                <br />
                <span className="italic font-light text-white/60">of Form</span>
              </h2>

              <p className="text-sm md:text-base text-white/40 leading-relaxed mb-8 max-w-md">
                NEUVE is an independent fashion brand inspired by the art, science and
                minimalism. Before this project, all sales happened manually through
                Instagram DMs. The client needed a website that would reflect their
                aesthetic and automate the shopping experience.
              </p>

              <p className="text-sm md:text-base text-white/40 leading-relaxed mb-10 max-w-md">
                I created this website from scratch — from wireframe to UI design — with a focus
                on elegance, usability and mobile accessibility.
              </p>

              <Link href="/shop" className="btn-outline">
                Discover More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== SPLIT CTA SECTION ==================== */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
          alt="New Arrivals Collection"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary-950/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">
              Spring / Summer 2026
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8">
              New Arrivals
            </h2>
            <Link href="/shop?sort=newest" className="btn-primary">
              Shop Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="py-20 md:py-32">
        <div className="container-luxury">
          <motion.div
            className="max-w-xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Stay Connected</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Join the Movement
            </h2>
            <p className="text-sm text-white/40 mb-8">
              Subscribe for exclusive access, early drops, and curated editorial content.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-luxury flex-1"
              />
              <button className="btn-primary whitespace-nowrap px-6">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
