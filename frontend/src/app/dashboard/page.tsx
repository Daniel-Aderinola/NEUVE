'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, User, Settings, LogOut, MapPin, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orderAPI } from '@/lib/api';
import { Order } from '@/lib/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || '',
    });

    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        name: profileData.name,
        phone: profileData.phone,
        address: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
          country: profileData.country,
        },
      });
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out');
  };

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    processing: 'text-blue-400 bg-blue-400/10',
    shipped: 'text-purple-400 bg-purple-400/10',
    delivered: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  };

  if (!user) return null;

  const tabs = [
    { id: 'orders' as const, label: 'Orders', icon: Package },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">My Account</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tighter">
            Welcome, {user.name}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="border border-white/5 divide-y divide-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-5 py-4 text-xs tracking-[0.15em] uppercase transition-all ${
                    activeTab === tab.id
                      ? 'text-white bg-white/5'
                      : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-4 text-xs tracking-[0.15em] uppercase text-white/40 hover:text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-display font-bold mb-6">Order History</h2>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-primary-800/20 animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 border border-white/5">
                    <Package className="w-10 h-10 text-white/10 mx-auto mb-4" />
                    <p className="text-sm text-white/40">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-white/5 p-5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <p className="text-sm font-medium">
                                #{order._id.slice(-8).toUpperCase()}
                              </p>
                              <span
                                className={`px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium ${
                                  statusColors[order.status]
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/30">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">${order.totalPrice.toFixed(2)}</span>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-display font-bold mb-6">Profile Information</h2>
                <form onSubmit={handleUpdateProfile} className="max-w-lg space-y-4">
                  <div>
                    <label className="text-xs text-white/30 mb-1.5 block">Full Name</label>
                    <input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-luxury"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/30 mb-1.5 block">Email</label>
                    <input
                      value={profileData.email}
                      className="input-luxury opacity-50"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/30 mb-1.5 block">Phone</label>
                    <input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="input-luxury"
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="text-xs tracking-[0.2em] uppercase text-white/30 mb-4 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <input
                          placeholder="Street address"
                          value={profileData.street}
                          onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                          className="input-luxury"
                        />
                      </div>
                      <input
                        placeholder="City"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        className="input-luxury"
                      />
                      <input
                        placeholder="State"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        className="input-luxury"
                      />
                      <input
                        placeholder="ZIP Code"
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                        className="input-luxury"
                      />
                      <input
                        placeholder="Country"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        className="input-luxury"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary mt-6">
                    Save Changes
                  </button>
                </form>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-display font-bold mb-6">Account Settings</h2>
                <div className="max-w-lg space-y-6">
                  <div className="border border-white/5 p-5">
                    <h3 className="text-sm font-medium mb-1">Change Password</h3>
                    <p className="text-xs text-white/30 mb-4">Update your password</p>
                    <div className="space-y-3">
                      <input type="password" placeholder="Current password" className="input-luxury" />
                      <input type="password" placeholder="New password" className="input-luxury" />
                      <input type="password" placeholder="Confirm new password" className="input-luxury" />
                      <button className="btn-outline text-xs">Update Password</button>
                    </div>
                  </div>

                  <div className="border border-red-500/20 p-5">
                    <h3 className="text-sm font-medium text-red-400 mb-1">Danger Zone</h3>
                    <p className="text-xs text-white/30 mb-4">
                      Once deleted, your account cannot be recovered.
                    </p>
                    <button className="px-4 py-2 border border-red-500/30 text-red-400 text-xs tracking-wider uppercase hover:bg-red-500/10 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
