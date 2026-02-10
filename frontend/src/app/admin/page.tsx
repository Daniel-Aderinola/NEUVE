'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3, Package, ShoppingBag, Users, DollarSign,
  Plus, Edit, Trash2, LogOut, ChevronRight, X, Eye,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { productAPI, categoryAPI, orderAPI, authAPI } from '@/lib/api';
import { Product, Category, Order, DashboardStats, User } from '@/lib/types';
import toast from 'react-hot-toast';

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'categories';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', slug: '', description: '', price: '', comparePrice: '',
    images: '', category: '', sizes: '', colors: '', stock: '', featured: false,
  });

  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchDashboard();
  }, [user, authLoading, router]);

  const fetchDashboard = async () => {
    setLoading(true);

    // Fetch each independently — never let one failure break the others
    try {
      const productsRes = await productAPI.adminGetAll();
      setProducts(productsRes.data?.products || []);
    } catch (e) {
      console.error('Failed to load products:', e);
      setProducts([]);
    }

    try {
      const categoriesRes = await categoryAPI.getAll();
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (e) {
      console.error('Failed to load categories:', e);
      setCategories([]);
    }

    try {
      const statsRes = await orderAPI.getStats();
      setStats(statsRes.data || null);
    } catch (e) {
      console.error('Failed to load stats:', e);
      setStats(null);
    }

    try {
      const ordersRes = await orderAPI.getAll();
      setOrders(ordersRes.data?.orders || []);
    } catch (e) {
      console.error('Failed to load orders:', e);
      setOrders([]);
    }

    try {
      const usersRes = await authAPI.getUsers();
      setUsers(usersRes.data?.users || []);
    } catch (e) {
      console.error('Failed to load users:', e);
      setUsers([]);
    }

    setLoading(false);
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() || '',
        images: product.images.join(', '),
        category: typeof product.category === 'object' ? product.category._id : product.category,
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', '),
        stock: product.stock.toString(),
        featured: product.featured,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '', slug: '', description: '', price: '', comparePrice: '',
        images: '', category: categories[0]?._id || '', sizes: '', colors: '', stock: '', featured: false,
      });
    }
    setShowModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: productForm.name,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-'),
        description: productForm.description,
        price: Number(productForm.price),
        comparePrice: productForm.comparePrice ? Number(productForm.comparePrice) : undefined,
        images: productForm.images.split(',').map((s) => s.trim()).filter(Boolean),
        category: productForm.category,
        sizes: productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: productForm.colors.split(',').map((s) => s.trim()).filter(Boolean),
        stock: Number(productForm.stock),
        featured: productForm.featured,
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, data);
        toast.success('Product updated');
      } else {
        await productAPI.create(data);
        toast.success('Product created');
      }

      setShowModal(false);
      fetchDashboard();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Order status updated');
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await authAPI.deleteUser(id);
      toast.success('User deleted');
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    processing: 'text-blue-400 bg-blue-400/10',
    shipped: 'text-purple-400 bg-purple-400/10',
    delivered: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Overview', icon: Settings },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: BarChart3 },
  ];

  if (authLoading || !user || user.role !== 'admin') return null;

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">Administration</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tighter">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs tracking-[0.1em] uppercase whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'text-white bg-white/5 border border-white/10'
                      : 'text-white/40 hover:text-white border border-transparent'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-primary-800/20 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* DASHBOARD TAB */}
                {activeTab === 'dashboard' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Stats cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                      {[
                        { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
                        { label: 'Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-400' },
                        { label: 'Products', value: stats?.totalProducts || products.length, icon: Package, color: 'text-purple-400' },
                        { label: 'Pending', value: stats?.pendingOrders || 0, icon: BarChart3, color: 'text-yellow-400' },
                      ].map((stat, i) => (
                        <div key={i} className="border border-white/5 p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">{stat.label}</span>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                          </div>
                          <p className="text-2xl font-display font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recent Orders */}
                    <h3 className="text-sm tracking-[0.15em] uppercase font-medium mb-4">Recent Orders</h3>
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className="border border-white/5 divide-y divide-white/5">
                      {stats.recentOrders.map((order) => (
                        <div key={order?._id || Math.random()} className="flex items-center justify-between p-4">
                          <div>
                            <p className="text-sm font-medium">#{(order?._id || '').slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-white/30 mt-0.5">
                              {typeof order?.user === 'object' ? order.user?.name : 'Unknown'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium ${statusColors[order?.status] || ''}`}>
                              {order?.status || 'unknown'}
                            </span>
                            <span className="text-sm">${(order?.totalPrice ?? 0).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    ) : (
                      <div className="border border-white/5 p-8 text-center">
                        <p className="text-sm text-white/30">No orders yet</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-display font-bold">
                        Products ({products.length})
                      </h2>
                      <button onClick={() => openProductModal()} className="btn-primary text-xs py-2.5 px-5">
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add Product
                      </button>
                    </div>

                    <div className="border border-white/5 divide-y divide-white/5">
                      {products.map((product) => (
                        <div key={product._id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-12 bg-primary-800 shrink-0 overflow-hidden">
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-white/30">${product.price} · Stock: {product.stock}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            {product.featured && (
                              <span className="text-[9px] tracking-wider uppercase text-accent bg-accent/10 px-2 py-0.5">
                                Featured
                              </span>
                            )}
                            <button
                              onClick={() => openProductModal(product)}
                              className="p-2 text-white/30 hover:text-white transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-white/30 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-lg font-display font-bold mb-6">
                      Orders ({orders.length})
                    </h2>

                    <div className="border border-white/5 divide-y divide-white/5">
                      {orders.map((order) => (
                        <div key={order?._id || Math.random()} className="p-4 hover:bg-white/[0.02] transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-3">
                                <p className="text-sm font-medium">#{(order?._id || '').slice(-8).toUpperCase()}</p>
                                <span className={`px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium ${statusColors[order?.status] || ''}`}>
                                  {order?.status || 'unknown'}
                                </span>
                              </div>
                              <p className="text-xs text-white/30 mt-1">
                                {typeof order?.user === 'object' ? order.user?.email : ''} · {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <select
                                value={order?.status || 'pending'}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                className="bg-transparent border border-white/10 px-3 py-1.5 text-xs text-white/70 focus:outline-none"
                              >
                                <option value="pending" className="bg-primary-950">Pending</option>
                                <option value="processing" className="bg-primary-950">Processing</option>
                                <option value="shipped" className="bg-primary-950">Shipped</option>
                                <option value="delivered" className="bg-primary-950">Delivered</option>
                                <option value="cancelled" className="bg-primary-950">Cancelled</option>
                              </select>
                              <span className="text-sm font-medium">${(order?.totalPrice ?? 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-lg font-display font-bold mb-6">
                      Users ({users.length})
                    </h2>

                    <div className="border border-white/5 divide-y divide-white/5">
                      {users.map((u) => (
                        <div key={u._id} className="flex items-center justify-between p-4">
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-xs text-white/30">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium ${
                              u.role === 'admin' ? 'text-accent bg-accent/10' : 'text-white/40 bg-white/5'
                            }`}>
                              {u.role}
                            </span>
                            {u._id !== user?._id && (
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-2 text-white/30 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-lg font-display font-bold mb-6">
                      Categories ({categories.length})
                    </h2>

                    <div className="border border-white/5 divide-y divide-white/5">
                      {categories.map((cat) => (
                        <div key={cat._id} className="flex items-center justify-between p-4">
                          <div>
                            <p className="text-sm font-medium">{cat.name}</p>
                            <p className="text-xs text-white/30">{cat.slug}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Edit className="w-3.5 h-3.5 text-white/30 cursor-pointer hover:text-white transition-colors" />
                            <Trash2 className="w-3.5 h-3.5 text-white/30 cursor-pointer hover:text-red-400 transition-colors"
                              onClick={() => {
                                if (confirm('Delete category?')) {
                                  categoryAPI.delete(cat._id).then(() => {
                                    toast.success('Deleted');
                                    fetchDashboard();
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-950 border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-bold">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs text-white/30 mb-1 block">Name</label>
                <input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="input-luxury"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/30 mb-1 block">Slug</label>
                <input
                  value={productForm.slug}
                  onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                  className="input-luxury"
                  placeholder="Auto-generated from name"
                />
              </div>
              <div>
                <label className="text-xs text-white/30 mb-1 block">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="input-luxury min-h-[80px] resize-y"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/30 mb-1 block">Price</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1 block">Compare Price</label>
                  <input
                    type="number"
                    value={productForm.comparePrice}
                    onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                    className="input-luxury"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/30 mb-1 block">Image URLs (comma-separated)</label>
                <input
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  className="input-luxury"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/30 mb-1 block">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="input-luxury"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-primary-950">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/30 mb-1 block">Sizes (comma-separated)</label>
                  <input
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    className="input-luxury"
                    placeholder="S, M, L, XL"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/30 mb-1 block">Colors (comma-separated)</label>
                  <input
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    className="input-luxury"
                    placeholder="Black, White"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/30 mb-1 block">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-3">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4 accent-white"
                    />
                    <span className="text-xs text-white/60">Featured Product</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
