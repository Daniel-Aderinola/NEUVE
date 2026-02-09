'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productAPI, categoryAPI } from '@/lib/api';
import { Product, Category } from '@/lib/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 12,
        sort: sortBy,
      };

      if (selectedCategory) params.category = selectedCategory;
      if (priceRange[0] > 0) params.minPrice = priceRange[0];
      if (priceRange[1] < 1000) params.maxPrice = priceRange[1];
      if (searchQuery) params.search = searchQuery;
      if (searchParams.get('featured')) params.featured = 'true';

      const { data } = await productAPI.getProducts(params);
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, sortBy, priceRange, searchQuery, searchParams]);

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSortBy('newest');
    setPriceRange([0, 1000]);
    setSearchQuery('');
    setPage(1);
  };

  const activeFilterCount = [
    selectedCategory,
    priceRange[0] > 0 || priceRange[1] < 1000,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Page Header */}
      <div className="container-luxury mb-10 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">
            {searchQuery ? `Results for "${searchQuery}"` : 'Browse'}
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">
            {searchParams.get('featured') ? 'Featured' : 'Shop All'}
          </h1>
          <p className="text-sm text-white/40 mt-3">{total} products</p>
        </motion.div>
      </div>

      <div className="container-luxury">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-white text-primary-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 hidden sm:block">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="appearance-none bg-transparent border border-white/10 px-4 py-2 pr-8 text-xs tracking-wider text-white/70 focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="newest" className="bg-primary-950">Newest</option>
                <option value="price-asc" className="bg-primary-950">Price: Low to High</option>
                <option value="price-desc" className="bg-primary-950">Price: High to Low</option>
                <option value="rating" className="bg-primary-950">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-white/5">
                {/* Category */}
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-white/30 mb-3 block">
                    Category
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => { setSelectedCategory(''); setPage(1); }}
                      className={`block text-sm transition-colors ${
                        !selectedCategory ? 'text-white' : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                        className={`block text-sm transition-colors ${
                          selectedCategory === cat._id ? 'text-white' : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-white/30 mb-3 block">
                    Price Range
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0] || ''}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 input-luxury py-2 text-xs"
                    />
                    <span className="text-white/30">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1] === 1000 ? '' : priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 1000])}
                      className="w-24 input-luxury py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Search */}
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-white/30 mb-3 block">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-luxury py-2 text-xs"
                  />
                </div>

                {/* Clear */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-primary-800/50 mb-4" />
                <div className="h-2 bg-primary-800/50 w-16 mb-2" />
                <div className="h-3 bg-primary-800/50 w-32 mb-2" />
                <div className="h-3 bg-primary-800/50 w-16" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-display font-bold mb-2">No products found</h3>
            <p className="text-sm text-white/40 mb-6">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="btn-outline">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 text-xs font-medium transition-all ${
                  page === i + 1
                    ? 'bg-white text-primary-950'
                    : 'border border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="pt-20 md:pt-24 pb-20 container-luxury">
        <div className="animate-pulse">
          <div className="h-4 bg-primary-800/50 w-20 mb-3" />
          <div className="h-10 bg-primary-800/50 w-48 mb-10" />
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
