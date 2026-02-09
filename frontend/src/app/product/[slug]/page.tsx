'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Heart, ArrowLeft, Check } from 'lucide-react';
import { productAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await productAPI.getProductBySlug(slug as string);
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);

        // Fetch related products
        const { data: related } = await productAPI.getRelated(data._id);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product._id, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20 container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="aspect-[3/4] bg-primary-800/30 animate-pulse" />
          <div className="space-y-4 pt-8">
            <div className="h-3 bg-primary-800/30 w-20 animate-pulse" />
            <div className="h-8 bg-primary-800/30 w-64 animate-pulse" />
            <div className="h-5 bg-primary-800/30 w-24 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-20 container-luxury text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="btn-outline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="container-luxury">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-primary-900 mb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Sale badge */}
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-white text-primary-950 text-[10px] font-medium tracking-wider uppercase">
                  Sale
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-20 md:w-20 md:h-24 overflow-hidden transition-all ${
                      selectedImage === i
                        ? 'border border-white'
                        : 'border border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pt-4"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">
              {typeof product.category === 'object' ? product.category.name : ''}
            </p>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl md:text-2xl font-light">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-base text-white/30 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${
                      i < Math.round(product.rating) ? 'text-accent' : 'text-white/10'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-white/30">({product.numReviews} reviews)</span>
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-lg">
              {product.description}
            </p>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-3">
                  Color — <span className="text-white/60">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs tracking-wider border transition-all ${
                        selectedColor === color
                          ? 'border-white text-white'
                          : 'border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-3">
                  Size — <span className="text-white/60">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-11 px-3 text-xs font-medium tracking-wider border transition-all ${
                        selectedSize === size
                          ? 'border-white text-white bg-white/5'
                          : 'border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border border-white/10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-white/40 hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-white/40 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium tracking-[0.1em] uppercase transition-all duration-500 ${
                  product.stock === 0
                    ? 'bg-primary-800 text-white/30 cursor-not-allowed'
                    : added
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-primary-950 hover:bg-primary-200'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>

              <button className="p-3.5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Stock info */}
            <p className="text-xs text-white/30">
              {product.stock > 0 ? `${product.stock} items in stock` : 'Currently out of stock'}
            </p>

            {/* Details */}
            <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors py-2">
                  Details & Care
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-white/40 leading-relaxed pt-3 pb-4">
                  {product.description}. Handle with care. Professional clean recommended.
                </p>
              </details>
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors py-2">
                  Shipping & Returns
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-white/40 leading-relaxed pt-3 pb-4">
                  Free shipping on orders over $100. Standard shipping 3-5 business days.
                  Express shipping available. 30-day return policy for unworn items.
                </p>
              </details>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 md:mt-32">
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tighter mb-10">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
