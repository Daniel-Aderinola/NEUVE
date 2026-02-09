'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: In production, connect to password reset API
    setSent(true);
    toast.success('If an account exists, a reset link has been sent.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-display font-bold tracking-[0.15em] uppercase">
            NEUVE
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mt-8 mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-white/40">
            {sent
              ? 'Check your email for a reset link'
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/30 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-luxury"
                placeholder="your@email.com"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-6">
              Send Reset Link
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✉️</span>
            </div>
            <p className="text-sm text-white/40 mb-6">
              We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
            <button onClick={() => setSent(false)} className="text-xs text-white/40 hover:text-white transition-colors">
              Didn&apos;t receive it? Try again
            </button>
          </div>
        )}

        <p className="text-center mt-8">
          <Link
            href="/login"
            className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
