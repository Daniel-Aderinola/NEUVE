'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 border-t border-white/5">
      <div className="container-luxury py-16 md:py-24">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-display font-bold tracking-[0.15em] uppercase mb-4">
              NEUVE
            </h2>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              An independent fashion brand inspired by the art, science and minimalism.
              Beyond form, in the motion of expression.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-6">
              Navigation
            </h3>
            <ul className="space-y-3">
              {['Shop', 'Collections', 'Featured', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Shop' ? '/shop' : `/${item.toLowerCase()}`}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-6">
              Customer Care
            </h3>
            <ul className="space-y-3">
              {['Shipping & Returns', 'Size Guide', 'FAQ', 'Privacy Policy', 'Terms & Conditions'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-6">
              Newsletter
            </h3>
            <p className="text-sm text-white/40 mb-4">
              Subscribe for exclusive access and first looks at new collections.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button className="ml-3 pb-2 border-b border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-xs text-white/30 tracking-wider">
            &copy; {currentYear} NEUVE. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-white/30 hover:text-white transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-white/30 hover:text-white transition-colors duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
