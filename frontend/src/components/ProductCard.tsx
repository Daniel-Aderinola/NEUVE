'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' : product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-primary-900 mb-4">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

          {/* Quick view button */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury"
          >
            <span className="block w-full py-2.5 bg-white/90 backdrop-blur-sm text-primary-950 text-xs font-medium tracking-[0.15em] uppercase text-center">
              Quick View
            </span>
          </motion.div>

          {/* Sale badge */}
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-white text-primary-950 text-[10px] font-medium tracking-wider uppercase">
              Sale
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">
            {typeof product.category === 'object' ? product.category.name : ''}
          </p>
          <h3 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">${product.price.toFixed(2)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-white/30 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
