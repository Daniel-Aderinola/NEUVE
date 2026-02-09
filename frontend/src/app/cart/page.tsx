'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="pt-24 pb-20 container-luxury text-center min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="w-12 h-12 text-white/10 mb-6" />
        <h1 className="text-2xl font-display font-bold mb-3">Sign in to view your cart</h1>
        <p className="text-sm text-white/40 mb-8">You need to be logged in to access your shopping bag.</p>
        <Link href="/login" className="btn-primary">
          Sign In
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 pb-20 container-luxury">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-primary-800/30 w-32" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 py-6 border-b border-white/5">
              <div className="w-20 h-24 bg-primary-800/30" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-primary-800/30 w-40" />
                <div className="h-3 bg-primary-800/30 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tighter">
            Shopping Bag
          </h1>
          <p className="text-sm text-white/40 mt-2">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </motion.div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 text-white/10 mx-auto mb-6" />
            <h2 className="text-xl font-display font-bold mb-3">Your bag is empty</h2>
            <p className="text-sm text-white/40 mb-8">
              Discover our curated collection of contemporary fashion pieces.
            </p>
            <Link href="/shop" className="btn-primary">
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border-t border-white/5">
                {items.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 md:gap-6 py-6 border-b border-white/5"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.product.slug}`} className="shrink-0">
                      <div className="relative w-20 h-24 md:w-28 md:h-36 overflow-hidden bg-primary-900">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="text-sm font-medium hover:text-white/70 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex gap-3 mt-1">
                          {item.size && (
                            <span className="text-xs text-white/30">Size: {item.size}</span>
                          )}
                          {item.color && (
                            <span className="text-xs text-white/30">Color: {item.color}</span>
                          )}
                        </div>
                        <p className="text-sm text-white/60 mt-1">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-white/10">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove + subtotal */}
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 border border-white/5 p-6 md:p-8"
              >
                <h2 className="text-sm tracking-[0.2em] uppercase font-medium mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>${cart?.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Shipping</span>
                    <span>{(cart?.totalPrice || 0) > 100 ? 'Free' : '$10.00'}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Estimated Tax</span>
                    <span>${((cart?.totalPrice || 0) * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5 mb-8">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-medium">
                    ${(
                      (cart?.totalPrice || 0) +
                      ((cart?.totalPrice || 0) > 100 ? 0 : 10) +
                      (cart?.totalPrice || 0) * 0.08
                    ).toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout" className="btn-primary w-full text-center block">
                  Proceed to Checkout
                </Link>

                <p className="text-[10px] text-white/20 text-center mt-4">
                  Free shipping on orders over $100
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
