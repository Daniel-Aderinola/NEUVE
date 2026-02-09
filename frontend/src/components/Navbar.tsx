'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop?category=tops', label: 'Collections' },
    { href: '/shop?featured=true', label: 'Featured' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-primary-950/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop nav links - left */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logo - center */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-xl md:text-2xl font-display font-bold tracking-[0.15em] uppercase">
                NEUVE
              </h1>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-3 md:gap-5">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white/60 hover:text-white transition-colors duration-300"
                aria-label="Search"
              >
                <Search className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </button>

              <Link
                href={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'}
                className="p-2 text-white/60 hover:text-white transition-colors duration-300"
                aria-label="Account"
              >
                <User className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </Link>

              <Link
                href="/cart"
                className="p-2 text-white/60 hover:text-white transition-colors duration-300 relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-primary-950 text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/5 overflow-hidden"
            >
              <div className="container-luxury py-4">
                <div className="relative max-w-xl mx-auto">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 text-sm tracking-wide"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value;
                        window.location.href = `/shop?search=${value}`;
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                  <Search className="absolute right-0 top-0 w-4 h-4 text-white/30" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-primary-950 z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-lg font-display font-bold tracking-[0.15em] uppercase">
                  NEUVE
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-6 py-4 text-sm font-medium tracking-[0.15em] uppercase text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-white/5 space-y-3">
                {user ? (
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="btn-outline w-full text-center text-xs"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="btn-primary w-full text-center text-xs"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="btn-outline w-full text-center text-xs"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
