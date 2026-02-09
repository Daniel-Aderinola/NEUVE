'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    phone: user?.phone || '',
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="pt-24 pb-20 container-luxury text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-display font-bold mb-3">Your cart is empty</h1>
        <Link href="/shop" className="btn-outline mt-4">Back to Shop</Link>
      </div>
    );
  }

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const required = ['fullName', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    try {
      setLoading(true);

      // Create order
      const { data: order } = await orderAPI.create({
        shippingAddress: formData,
      });

      // Create Stripe checkout session
      const { data: session } = await orderAPI.createCheckoutSession(order._id);

      if (session.url) {
        window.location.href = session.url;
      } else {
        // If no Stripe URL (e.g., demo mode), redirect to order page
        toast.success('Order placed successfully!');
        router.push(`/dashboard`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tighter">
            Checkout
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Shipping Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h2 className="text-sm tracking-[0.2em] uppercase font-medium mb-6">
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-white/30 mb-1.5 block">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-luxury"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-white/30 mb-1.5 block">Street Address</label>
                  <input
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">State / Province</label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">ZIP / Postal Code</label>
                  <input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1.5 block">Country</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input-luxury"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-white/30 mb-1.5 block">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-luxury"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 border border-white/5 p-6 md:p-8">
                <h2 className="text-sm tracking-[0.2em] uppercase font-medium mb-6">
                  Order Summary
                </h2>

                {/* Items preview */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="relative w-12 h-14 shrink-0 bg-primary-900 overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-primary-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/70 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-white/30">
                          {item.size && `${item.size}`}
                          {item.size && item.color && ' / '}
                          {item.color && `${item.color}`}
                        </p>
                      </div>
                      <p className="text-xs text-white/50 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm border-t border-white/5 pt-4 mb-6">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5 mb-6">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-medium">${total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {loading ? 'Processing...' : 'Place Order & Pay'}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <Lock className="w-3 h-3 text-white/20" />
                  <p className="text-[10px] text-white/20">
                    Secured by Stripe. Your data is encrypted.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
