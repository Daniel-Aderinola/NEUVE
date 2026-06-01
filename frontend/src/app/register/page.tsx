'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    const errors = [];
    if (pwd.length < 12) errors.push('At least 12 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('One number');
    if (!/[@$!%*?&]/.test(pwd)) errors.push('One special character (@$!%*?&)');
    return errors;
  };

  const passwordErrors = password ? validatePassword(password) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const errors = validatePassword(password);
    if (errors.length > 0) {
      toast.error(`Password must have: ${errors.join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, confirmPassword);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mt-8 mb-2">
            Create Account
          </h1>
          <p className="text-sm text-white/40">Join the NEUVE community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/30 mb-1.5 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-luxury"
              placeholder="Your name"
              required
            />
          </div>

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

          <div>
            <label className="text-xs text-white/30 mb-1.5 block">Password</label>
            <p className="text-xs text-white/40 mb-2">Must include 12+ characters, uppercase, lowercase, number, and special character (@$!%*?&)</p>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury pr-10"
                placeholder="SecurePass123!@"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && passwordErrors.length > 0 && (
              <div className="mt-2 text-xs text-red-400 space-y-1">
                <p>Password needs:</p>
                {passwordErrors.map((error) => (
                  <p key={error}>• {error}</p>
                ))}
              </div>
            )}
            {password && passwordErrors.length === 0 && (
              <p className="mt-2 text-xs text-green-400">✓ Password strength: Strong</p>
            )}
          </div>

          <div>
            <label className="text-xs text-white/30 mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-luxury pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-2 text-xs text-red-400">Passwords do not match</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="mt-2 text-xs text-green-400">✓ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </form>

        <p className="text-center text-sm text-white/30 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-white/70 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
