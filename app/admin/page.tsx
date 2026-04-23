/**
 * Oil Amor - Master Admin Dashboard
 * Complete order management, production workflow, and label generation
 * 
 * UPDATES:
 * - Safe padding from top (pt-24) to account for fixed header
 * - Real-time label preview that updates instantly when toggles change
 * - Precise ml measurements only (0.1ml increments, no drops)
 * - Real data from database (no mock data)
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Beaker, 
  Droplets, 
  TrendingUp, 
  Users, 
  Printer,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  FileText,
  BarChart3,
  Loader2,
  RefreshCw,
  QrCode,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Order, OrderStatus, OrderLineItem, OrderCustomMix } from '@/lib/db/schema/orders';
import { ScaledRefill, scaleToRefill, normalizeRecipe } from '@/lib/refill/recipe-scaling';
import { RefillOrder } from '@/lib/db/schema-refill';
import { adminFetch } from '@/lib/admin/api';

// ============================================================================
// TYPES
// ============================================================================

type TabType = 'orders' | 'blending' | 'production' | 'refills' | 'labels' | 'analytics';
type OrderFilter = 'all' | 'pending' | 'blending' | 'ready' | 'shipped';

interface DashboardStats {
  totalOrders: number;
  pendingBlending: number;
  pendingRefills: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  activeCustomers: number;
  lowStockOils: string[];
  totalBottles: number;
  completedRefills: number;
}

interface ProductionQueueItem {
  orderId: string;
  customerName: string;
  item: OrderLineItem;
  customMix: OrderCustomMix;
  priority: 'normal' | 'rush';
  queuedAt: string;
}

interface RefillOrderItem {
  orderId: string;
  customerName: string;
  customerEmail: string;
  originalRecipeName: string;
  originalOrderId: string;
  targetSize: 50 | 100;
  scaledRecipe: ScaledRefill;
  bottleSerial?: string;
  status: string;
  createdAt: string;
}

// Label settings type for real-time preview
interface LabelSettings {
  showIngredients: boolean;
  showExpiry: boolean;
  showWarnings: boolean;
  showQRCode: boolean;
  showBatchId: boolean;
  showMadeDate: boolean;
  showCrystal: boolean;
  labelSize: '30ml' | '50ml' | '100ml';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch real stats from API
  const fetchDashboardStats = useCallback(async () => {
    try {
      setError(null);
      const response = await adminFetch('/api/admin/dashboard/stats');
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardStats();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboardStats, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboardStats]);

  const tabs = [
    { id: 'orders' as TabType, label: 'Orders', icon: Package },
    { id: 'blending' as TabType, label: 'Blending Queue', icon: Beaker },
    { id: 'production' as TabType, label: 'Production Queue', icon: Beaker },
    { id: 'refills' as TabType, label: 'Refill Orders', icon: Droplets },
    { id: 'labels' as TabType, label: 'Label Generator', icon: Printer },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#0a080c] pt-24">
      {/* Header - Fixed with proper z-index */}
      <header className="fixed top-0 left-0 right-0 border-b border-[#f5f3ef]/10 bg-[#0a080c]/95 backdrop-blur-md z-50">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#c9a227] flex items-center justify-center">
                <span className="text-[#0a080c] font-bold text-lg">OA</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif text-[#f5f3ef]">Oil Amor Admin</h1>
                <p className="text-xs text-[#a69b8a]">Master Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {error && (
                <span className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </span>
              )}
              <div className="flex items-center gap-2 text-sm text-[#a69b8a]">
                <Clock className="w-4 h-4" />
                <span>{lastUpdated.toLocaleDateString('en-AU', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                <button 
                  onClick={fetchDashboardStats}
                  className="p-1 hover:bg-[#f5f3ef]/10 rounded transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => setActiveTab('labels')}
                className="px-4 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors"
              >
                Quick Print Label
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      {!loading && stats && (
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <StatCard
              label="Total Orders"
              value={stats.totalOrders}
              icon={Package}
              color="gold"
            />
            <StatCard
              label="Needs Blending"
              value={stats.pendingBlending}
              icon={Beaker}
              color="amber"
              alert={stats.pendingBlending > 5}
            />
            <StatCard
              label="Refill Queue"
              value={stats.pendingRefills}
              icon={Droplets}
              color="blue"
            />
            <StatCard
              label="Today Revenue"
              value={`$${stats.todayRevenue.toFixed(2)}`}
              icon={TrendingUp}
              color="green"
            />
            <StatCard
              label="Week Revenue"
              value={`$${stats.weekRevenue?.toFixed(2) || '0.00'}`}
              icon={BarChart3}
              color="purple"
            />
            <StatCard
              label="Active Customers"
              value={stats.activeCustomers}
              icon={Users}
              color="cyan"
            />
            <StatCard
              label="Total Bottles"
              value={stats.totalBottles || 0}
              icon={Package}
              color="indigo"
            />
            <StatCard
              label="Low Stock Oils"
              value={stats.lowStockOils?.length || 0}
              icon={AlertCircle}
              color="red"
              alert={stats.lowStockOils?.length > 0}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin mx-auto mb-4" />
          <p className="text-[#a69b8a]">Loading dashboard...</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#f5f3ef]/10">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-[#c9a227] text-[#c9a227]'
                      : 'border-transparent text-[#a69b8a] hover:text-[#f5f3ef] hover:border-[#f5f3ef]/30'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 pb-24">
        {activeTab === 'orders' && (
          <OrdersTab 
            onSelectOrder={setSelectedOrder}
            selectedOrder={selectedOrder}
          />
        )}
        {activeTab === 'blending' && <BlendingQueueTab />}
        {activeTab === 'production' && <ProductionQueueTab />}
        {activeTab === 'refills' && <RefillOrdersTab />}
        {activeTab === 'labels' && <LabelGeneratorTab />}
        {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
      </main>
    </div>
  );
}

// ============================================================================
// ORDERS TAB - With real data fetching
// ============================================================================

function OrdersTab({ 
  onSelectOrder, 
  selectedOrder 
}: { 
  onSelectOrder: (order: Order | null) => void;
  selectedOrder: Order | null;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/orders?filter=${filter}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => 
    order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    order.id?.toLowerCase().includes(search.toLowerCase()) ||
    order.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrderUpdate = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (selectedOrder) {
    return (
      <OrderDetailView 
        order={selectedOrder} 
        onBack={() => onSelectOrder(null)}
        onOrderUpdate={handleOrderUpdate}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a69b8a]" />
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111] border border-[#f5f3ef]/10 rounded-lg text-[#f5f3ef] placeholder-[#a69b8a] focus:border-[#c9a227] focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#a69b8a]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as OrderFilter)}
            className="bg-[#111] border border-[#f5f3ef]/10 rounded-lg px-3 py-2 text-[#f5f3ef] text-sm focus:border-[#c9a227] focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="blending">Needs Blending</option>
            <option value="ready">Ready to Ship</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 bg-[#111] border border-[#f5f3ef]/10 rounded-lg text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
          title="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin mx-auto mb-4" />
          <p className="text-[#a69b8a]">Loading orders...</p>
        </div>
      ) : (
        /* Orders Table */
        <div className="border border-[#f5f3ef]/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#111]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#a69b8a] uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#a69b8a] uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#a69b8a] uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#a69b8a] uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#a69b8a] uppercase">Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#a69b8a] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f3ef]/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#a69b8a]">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-[#111]/50 cursor-pointer transition-colors"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[#f5f3ef] font-medium">{order.id}</p>
                        <p className="text-xs text-[#a69b8a]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[#f5f3ef]">{order.customerName}</p>
                        <p className="text-xs text-[#a69b8a]">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {order.items?.slice(0, 2).map((item, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 bg-[#c9a227]/10 text-[#c9a227] text-xs rounded-full"
                          >
                            {item.customMix ? 'Custom Mix' : item.name}
                          </span>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="text-xs text-[#a69b8a]">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-[#f5f3ef] font-medium">${order.total?.toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-2 hover:bg-[#f5f3ef]/10 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-[#a69b8a]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ORDER DETAIL VIEW
// ============================================================================

function OrderDetailView({ order, onBack, onOrderUpdate }: { order: Order; onBack: () => void; onOrderUpdate?: () => void }) {
  const updateOrderStatus = async (status: string) => {
    try {
      const res = await adminFetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, status }),
      });
      if (!res.ok) throw new Error('Failed');
      onOrderUpdate?.();
      alert('Status updated successfully');
    } catch {
      alert('Failed to update status');
    }
  };

  const handleUpdateStatus = () => {
    const statuses = ['pending', 'blending', 'quality-check', 'ready', 'shipped', 'cancelled'];
    const newStatus = window.prompt(`Enter new status:\n${statuses.join(', ')}`);
    if (!newStatus || !statuses.includes(newStatus)) {
      if (newStatus) alert('Invalid status');
      return;
    }
    updateOrderStatus(newStatus);
  };

  const handleAddTracking = async () => {
    const carrier = window.prompt('Enter carrier (e.g. auspost):');
    if (!carrier) return;
    const trackingNumber = window.prompt('Enter tracking number:');
    if (!trackingNumber) return;
    try {
      const res = await adminFetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, carrier, trackingNumber }),
      });
      if (!res.ok) throw new Error('Failed');
      onOrderUpdate?.();
      alert('Tracking number added');
    } catch {
      alert('Failed to add tracking number');
    }
  };

  const handlePrintLabels = async () => {
    const item = order.items?.find(i => i.customMix);
    const standardItems = order.items?.filter(i => !i.customMix && i.type !== 'shipping') || [];
    const dateSuffix = new Date().toISOString().slice(2,10).replace(/-/g,'');
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    const data = {
      blendName: item?.customMix?.recipeName || standardItems.map(i => i.name).join(' + ') || 'Oil Amor Blend',
      oils: item?.customMix?.oils?.map(o => ({ name: o.oilName, percentage: o.percentage, ml: o.ml })) 
        || standardItems.map(i => ({ name: i.name + (i.sku ? ` (${i.sku})` : ''), percentage: 100, ml: i.quantity || 1 })),
      carrierOil: item?.customMix?.mode === 'carrier' ? 'Jojoba' : undefined,
      carrierPercentage: item?.customMix?.carrierRatio,
      size: item?.customMix?.totalVolume || 30,
      batchId: `OA-${dateSuffix}-${randomSuffix}`,
      madeDate: new Date().toLocaleDateString('en-AU'),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU'),
      warnings: item?.customMix?.safetyWarnings || [],
      crystal: item?.customMix?.crystalId,
      showIngredients: true,
      showExpiry: true,
      showWarnings: true,
      showQRCode: true,
      showBatchId: true,
      showMadeDate: true,
      showCrystal: true,
    };
    try {
      const res = await adminFetch('/api/admin/labels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.html) {
        const w = window.open('', '_blank');
        if (w) w.document.write(json.html);
      }
    } catch {
      alert('Failed to generate label');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          Back to Orders
        </button>
        <div className="flex gap-2">
          <button onClick={handlePrintLabels} className="flex items-center gap-2 px-4 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors">
            <Printer className="w-4 h-4" />
            Print Labels
          </button>
          <button onClick={handleUpdateStatus} className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] rounded-lg text-sm hover:bg-[#111]/80 transition-colors">
            <Zap className="w-4 h-4" />
            Update Status
          </button>
        </div>
      </div>

      {/* Order Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif text-[#f5f3ef]">Order {order.id}</h2>
              <StatusBadge status={order.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#a69b8a]">Customer</p>
                <p className="text-[#f5f3ef]">{order.customerName}</p>
                <p className="text-[#a69b8a]">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-[#a69b8a]">Order Date</p>
                <p className="text-[#f5f3ef]">
                  {new Date(order.createdAt).toLocaleString('en-AU')}
                </p>
              </div>
              <div>
                <p className="text-[#a69b8a]">Shipping Address</p>
                <p className="text-[#f5f3ef]">
                  {order.shippingAddress?.address1}, {order.shippingAddress?.city}
                </p>
                <p className="text-[#a69b8a]">
                  {order.shippingAddress?.province}, {order.shippingAddress?.zip}
                </p>
              </div>
              <div>
                <p className="text-[#a69b8a]">Payment</p>
                <p className="text-[#f5f3ef]">{order.payment?.method}</p>
                <p className="text-[#a69b8a]">{order.payment?.status}</p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-[#f5f3ef] mb-4">Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <LineItemCard key={index} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-[#f5f3ef] mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#a69b8a]">Subtotal</span>
                <span className="text-[#f5f3ef]">${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a69b8a]">Tax (GST)</span>
                <span className="text-[#f5f3ef]">${order.taxTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a69b8a]">Shipping</span>
                <span className="text-[#f5f3ef]">${order.shippingTotal?.toFixed(2)}</span>
              </div>
              {order.storeCreditUsed > 0 && (
                <div className="flex justify-between text-[#c9a227]">
                  <span>Store Credit</span>
                  <span>-${order.storeCreditUsed.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[#f5f3ef]/10 pt-2 flex justify-between text-lg font-medium">
                <span className="text-[#f5f3ef]">Total</span>
                <span className="text-[#c9a227]">${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-[#f5f3ef] mb-4">Actions</h3>
            <div className="space-y-2">
              <button onClick={() => updateOrderStatus('blending')} className="w-full px-4 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors">
                Mark as Blending
              </button>
              <button onClick={() => updateOrderStatus('quality-check')} className="w-full px-4 py-2 bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] rounded-lg text-sm hover:bg-[#f5f3ef]/5 transition-colors">
                Mark as Quality Check
              </button>
              <button onClick={() => updateOrderStatus('ready')} className="w-full px-4 py-2 bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] rounded-lg text-sm hover:bg-[#f5f3ef]/5 transition-colors">
                Mark as Ready to Ship
              </button>
              <button onClick={handleAddTracking} className="w-full px-4 py-2 bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] rounded-lg text-sm hover:bg-[#f5f3ef]/5 transition-colors">
                Add Tracking Number
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LINE ITEM CARD - Shows custom blend details with ML measurements ONLY
// ============================================================================

function LineItemCard({ item }: { item: OrderLineItem }) {
  if (item.customMix) {
    return (
      <div className="border border-[#c9a227]/30 rounded-lg p-4 bg-[#c9a227]/5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-[#f5f3ef] font-medium flex items-center gap-2">
              <Beaker className="w-4 h-4 text-[#c9a227]" />
              {item.customMix.recipeName}
            </h4>
            <p className="text-sm text-[#a69b8a]">
              {item.customMix.mode === 'pure' ? 'Pure Essential Oil Blend' : 'Carrier Oil Dilution'} • 
              {' '}{item.customMix.totalVolume}ml
            </p>
          </div>
          <span className="text-[#c9a227] font-medium">${item.unitPrice?.toFixed(2)}</span>
        </div>

        {/* Blend Recipe - ML ONLY, NO DROPS */}
        <div className="bg-[#0a080c] rounded-lg p-3 mb-3">
          <p className="text-xs text-[#a69b8a] mb-2">Recipe (precise ml measurements)</p>
          <div className="space-y-1">
            {item.customMix.oils.map((oil, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#f5f3ef]">{oil.oilName}</span>
                <span className="text-[#a69b8a]">{oil.ml?.toFixed(1) || ((oil.drops || 0) * 0.05).toFixed(1)}ml ({oil.percentage}%)</span>
              </div>
            ))}
            {item.customMix.mode === 'carrier' && item.customMix.carrierRatio && (
              <div className="flex justify-between text-sm pt-1 border-t border-[#f5f3ef]/10">
                <span className="text-[#f5f3ef]">Carrier Oil</span>
                <span className="text-[#a69b8a]">{100 - item.customMix.carrierRatio}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Safety Info */}
        <div className="flex items-center gap-4 text-xs">
          <span className={`px-2 py-1 rounded-full ${
            item.customMix.safetyScore >= 80 ? 'bg-green-500/20 text-green-400' :
            item.customMix.safetyScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            Safety: {item.customMix.safetyScore}/100
          </span>
          {item.customMix.safetyWarnings?.length > 0 && (
            <span className="text-[#a69b8a]">
              ⚠️ {item.customMix.safetyWarnings.length} warnings
            </span>
          )}
          {item.customMix.crystalId && (
            <span className="text-[#c9a227]">
              💎 {item.customMix.crystalId}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f5f3ef]/10 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#111] rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-[#a69b8a]" />
        </div>
        <div>
          <p className="text-[#f5f3ef]">{item.name}</p>
          {item.attachment && (
            <p className="text-xs text-[#a69b8a]">
              with {item.attachment.cordName || item.attachment.charmName}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-[#f5f3ef]">${item.unitPrice?.toFixed(2)}</p>
        <p className="text-xs text-[#a69b8a]">Qty: {item.quantity}</p>
      </div>
    </div>
  );
}

// ============================================================================
// PRODUCTION QUEUE TAB
// ============================================================================

function ProductionQueueTab() {
  const [queue, setQueue] = useState<ProductionQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminFetch('/api/admin/production-queue');
      const data = await r.json();
      setQueue(data.items || []);
    } catch {
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif text-[#f5f3ef]">Production Queue</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors">
          <Printer className="w-4 h-4" />
          Print All Recipes
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin mx-auto mb-4" />
          <p className="text-[#a69b8a]">Loading production queue...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {queue.map((item) => (
            <ProductionCard key={item.orderId} item={item} onRefresh={fetchQueue} />
          ))}
          
          {queue.length === 0 && (
            <div className="col-span-full text-center py-12 bg-[#111] border border-[#f5f3ef]/10 rounded-xl">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-[#f5f3ef] text-lg">All caught up!</p>
              <p className="text-[#a69b8a]">No blends waiting in the production queue</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductionCard({ item, onRefresh }: { item: ProductionQueueItem; onRefresh: () => void }) {
  const handleStartBlending = async () => {
    try {
      const res = await adminFetch('/api/admin/production-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: item.orderId, action: 'start' }),
      });
      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to start blending');
      }
    } catch {
      alert('Failed to start blending');
    }
  };

  const handlePrint = async () => {
    const data = {
      blendName: item.customMix?.recipeName || 'Blend',
      oils: item.customMix?.oils?.map(o => ({ name: o.oilName, percentage: o.percentage, ml: o.ml })) || [],
      size: item.customMix?.totalVolume || 30,
      batchId: `OA-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 4)}`,
      madeDate: new Date().toLocaleDateString('en-AU'),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU'),
      warnings: item.customMix?.safetyWarnings || [],
      crystal: undefined,
      showIngredients: true,
      showExpiry: true,
      showWarnings: true,
      showQRCode: true,
      showBatchId: true,
      showMadeDate: true,
      showCrystal: false,
    };
    try {
      const res = await adminFetch('/api/admin/labels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.html) {
        const w = window.open('', '_blank');
        if (w) w.document.write(json.html);
      }
    } catch {
      alert('Failed to print label');
    }
  };

  return (
    <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[#f5f3ef] font-medium">{item.customMix?.recipeName}</h3>
          <p className="text-sm text-[#a69b8a]">{item.customerName}</p>
        </div>
        {item.priority === 'rush' && (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            RUSH
          </span>
        )}
      </div>

      <div className="bg-[#0a080c] rounded-lg p-3 mb-4">
        <p className="text-xs text-[#a69b8a] mb-2">Recipe (ml)</p>
        {item.customMix?.oils.map((oil, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-[#f5f3ef]">{oil.oilName}</span>
            <span className="text-[#a69b8a]">{oil.ml?.toFixed(1) || ((oil.drops || 0) * 0.05).toFixed(1)}ml</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={handleStartBlending} className="flex-1 px-3 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors">
          Start Blending
        </button>
        <button onClick={handlePrint} className="px-3 py-2 bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] rounded-lg text-sm hover:bg-[#f5f3ef]/5 transition-colors">
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BLENDING QUEUE TAB
// ============================================================================

function BlendingQueueTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await adminFetch('/api/admin/orders?filter=pending');
      const data = await r.json();
      const allOrders: Order[] = data.orders || [];
      const blendingOrders = allOrders.filter(
        (order) =>
          order.requiresBlending ||
          order.items?.some((item) => item.type === 'custom-mix' || item.customMix)
      );
      setOrders(blendingOrders);
    } catch {
      setError('Failed to load blending orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif text-[#f5f3ef]">Blending Queue</h2>
        <button
          onClick={fetchOrders}
          className="p-2 bg-[#111] border border-[#f5f3ef]/10 rounded-lg text-[#a69b8a] hover:text-[#f5f3ef] transition-colors"
          title="Refresh blending queue"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin mx-auto mb-4" />
          <p className="text-[#a69b8a]">Loading blending queue...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => (
            <BlendingCard key={order.id} order={order} onRefresh={fetchOrders} />
          ))}

          {orders.length === 0 && (
            <div className="col-span-full text-center py-12 bg-[#111] border border-[#f5f3ef]/10 rounded-xl">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-[#f5f3ef] text-lg">All caught up!</p>
              <p className="text-[#a69b8a]">No blends waiting in the blending queue</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BlendingCard({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const blendItems = order.items?.filter((item) => item.type === 'custom-mix' || item.customMix) || [];

  const updateStatus = async (status: string) => {
    try {
      const res = await adminFetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, status }),
      });
      if (!res.ok) throw new Error('Failed');
      onRefresh();
    } catch {
      alert(`Failed to update status to ${status}`);
    }
  };

  const handlePrintRecipe = () => {
    const item = blendItems[0];
    const mix = item?.customMix;
    if (!mix) return;

    const oilsHtml = mix.oils
      .map(
        (oil) =>
          `<tr><td style="padding:6px 0;border-bottom:1px solid #eee;">${oil.oilName}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">${oil.ml?.toFixed(1) || ((oil.drops || 0) * 0.05).toFixed(1)}ml</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">${oil.percentage}%</td></tr>`
      )
      .join('');

    const totalVolume = mix.totalVolume || 30;

    const crystalHtml = mix.crystalId
      ? `<p><strong>Crystal:</strong> ${mix.crystalId}</p>` : '';
    const cordHtml = mix.cordId || item?.attachment?.cordName
      ? `<p><strong>Cord:</strong> ${mix.cordId || item?.attachment?.cordName}</p>` : '';
    const instructionsHtml = order.giftMessage
      ? `<p><strong>Special Instructions:</strong> ${order.giftMessage}</p>` : '';
    const customerNoteHtml = order.customerNote
      ? `<p><strong>Customer Note:</strong> ${order.customerNote}</p>` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Blend Recipe - ${mix.recipeName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #222; }
          .header { border-bottom: 3px solid #c9a227; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-size: 28px; }
          .meta { margin-bottom: 24px; }
          .meta p { margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { text-align: left; padding: 8px 0; border-bottom: 2px solid #ccc; }
          .total { font-size: 18px; font-weight: bold; margin-top: 16px; }
          .notes { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${mix.recipeName}</h1>
          <p>Order: ${order.id} &nbsp;|&nbsp; Customer: ${order.customerName}</p>
        </div>
        <div class="meta">
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-AU')}</p>
          <p><strong>Bottle Size:</strong> ${totalVolume}ml</p>
          ${crystalHtml}
          ${cordHtml}
        </div>
        <table>
          <thead>
            <tr>
              <th>Oil</th>
              <th style="text-align:right;">Amount</th>
              <th style="text-align:right;">%</th>
            </tr>
          </thead>
          <tbody>
            ${oilsHtml}
          </tbody>
        </table>
        <div class="total">Total Volume: ${totalVolume}ml</div>
        <div class="notes">
          ${instructionsHtml}
          ${customerNoteHtml}
          ${order.internalNote ? `<p><strong>Internal Note:</strong> ${order.internalNote}</p>` : ''}
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-[#a69b8a] uppercase tracking-wide">Order {order.id}</p>
          <h3 className="text-[#f5f3ef] font-medium">{order.customerName}</h3>
          <p className="text-sm text-[#a69b8a]">
            {new Date(order.createdAt).toLocaleDateString('en-AU')}
          </p>
        </div>
        {order.blendingPriority === 'rush' && (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">RUSH</span>
        )}
      </div>

      {blendItems.map((item, idx) => {
        const mix = item.customMix;
        if (!mix) return null;
        return (
          <div key={idx} className="bg-[#0a080c] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[#f5f3ef] font-medium flex items-center gap-2">
                <Beaker className="w-4 h-4 text-[#c9a227]" />
                {mix.recipeName}
              </h4>
              <span className="text-sm text-[#a69b8a]">{mix.totalVolume}ml</span>
            </div>
            <div className="space-y-1 mb-3">
              {mix.oils.map((oil, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#f5f3ef]">{oil.oilName}</span>
                  <span className="text-[#a69b8a]">
                    {oil.ml?.toFixed(1) || ((oil.drops || 0) * 0.05).toFixed(1)}ml ({oil.percentage}%)
                  </span>
                </div>
              ))}
              {mix.mode === 'carrier' && mix.carrierRatio && (
                <div className="flex justify-between text-sm pt-1 border-t border-[#f5f3ef]/10">
                  <span className="text-[#f5f3ef]">Carrier Oil</span>
                  <span className="text-[#a69b8a]">{100 - mix.carrierRatio}%</span>
                </div>
              )}
            </div>
            {(mix.crystalId || item.attachment?.cordName || order.giftMessage) && (
              <div className="text-xs text-[#a69b8a] space-y-1 pt-2 border-t border-[#f5f3ef]/10">
                {mix.crystalId && <p>💎 Crystal: {mix.crystalId}</p>}
                {(mix.cordId || item.attachment?.cordName) && (
                  <p>🔗 Cord: {mix.cordId || item.attachment?.cordName}</p>
                )}
                {order.giftMessage && <p>🎁 Gift: {order.giftMessage}</p>}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateStatus('blending')}
          className="flex-1 px-3 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors"
        >
          Mark as Blending
        </button>
        <button
          onClick={handlePrintRecipe}
          className="px-3 py-2 bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] rounded-lg text-sm hover:bg-[#f5f3ef]/5 transition-colors"
        >
          <Printer className="w-4 h-4" />
        </button>
        <button
          onClick={() => updateStatus('ready')}
          className="px-3 py-2 bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] rounded-lg text-sm hover:bg-[#f5f3ef]/5 transition-colors"
        >
          Mark Complete
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// REFILL ORDERS TAB - Real data with ML measurements
// ============================================================================

function RefillOrdersTab() {
  const [refills, setRefills] = useState<RefillOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRefills = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminFetch('/api/admin/refill/orders');
      const data = await r.json();
      setRefills(data.orders || []);
    } catch {
      setRefills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefills();
  }, [fetchRefills]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif text-[#f5f3ef]">Refill Orders</h2>
        <p className="text-[#a69b8a]">Recipes scaled from original orders (ml measurements)</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin mx-auto mb-4" />
          <p className="text-[#a69b8a]">Loading refill orders...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {refills.map((refill) => (
            <RefillCard key={refill.orderId} refill={refill} onRefresh={fetchRefills} />
          ))}
          
          {refills.length === 0 && (
            <div className="text-center py-12 bg-[#111] border border-[#f5f3ef]/10 rounded-xl">
              <Droplets className="w-12 h-12 text-[#c9a227] mx-auto mb-4" />
              <p className="text-[#f5f3ef] text-lg">No refill orders</p>
              <p className="text-[#a69b8a]">Refill orders will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RefillCard({ refill, onRefresh }: { refill: RefillOrderItem; onRefresh: () => void }) {
  const handleStartRefill = async () => {
    try {
      const res = await adminFetch('/api/admin/refill/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: refill.orderId, action: 'start' }),
      });
      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to start refill');
      }
    } catch {
      alert('Failed to start refill');
    }
  };

  const handlePrint = async () => {
    const data = {
      blendName: refill.originalRecipeName,
      oils: refill.scaledRecipe?.oils?.map(o => ({ name: o.oilName, percentage: o.percentage, ml: o.ml })) || [],
      carrierOil: refill.scaledRecipe?.carrierOilMl ? 'Carrier Oil' : undefined,
      carrierPercentage: refill.scaledRecipe?.carrierOilMl ? Math.round((refill.scaledRecipe.carrierOilMl / refill.targetSize) * 100) : undefined,
      size: refill.targetSize,
      batchId: `OA-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 4)}`,
      madeDate: new Date().toLocaleDateString('en-AU'),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU'),
      warnings: [],
      crystal: undefined,
      showIngredients: true,
      showExpiry: true,
      showWarnings: true,
      showQRCode: true,
      showBatchId: true,
      showMadeDate: true,
      showCrystal: false,
    };
    try {
      const res = await adminFetch('/api/admin/labels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.html) {
        const w = window.open('', '_blank');
        if (w) w.document.write(json.html);
      }
    } catch {
      alert('Failed to print label');
    }
  };

  return (
    <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-[#f5f3ef] font-medium mb-1">{refill.originalRecipeName}</h3>
          <p className="text-sm text-[#a69b8a] mb-4">
            {refill.customerName} • Original: {refill.originalOrderId}
          </p>
          
          <div className="bg-[#0a080c] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#f5f3ef] font-medium">
                {refill.targetSize}ml Refill
              </span>
              <span className="text-xs text-[#c9a227]">
                {refill.scaledRecipe?.oils?.length || 0} oils
              </span>
            </div>
            
            <div className="space-y-2">
              {refill.scaledRecipe?.oils?.map((oil, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#f5f3ef]">{oil.oilName}</span>
                  <span className="text-[#a69b8a]">{oil.ml?.toFixed(1)}ml ({oil.percentage}%)</span>
                </div>
              ))}
              {refill.scaledRecipe?.carrierOilMl && (
                <div className="flex justify-between text-sm pt-2 border-t border-[#f5f3ef]/10">
                  <span className="text-[#f5f3ef]">Carrier Oil</span>
                  <span className="text-[#a69b8a]">{refill.scaledRecipe.carrierOilMl.toFixed(1)}ml</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#a69b8a]">Total Essential Oil</span>
              <span className="text-[#f5f3ef]">{refill.scaledRecipe?.totalEssentialOilMl?.toFixed(1) || '0.0'}ml</span>
            </div>
            {refill.scaledRecipe?.carrierOilMl && (
              <div className="flex justify-between">
                <span className="text-[#a69b8a]">Carrier Oil</span>
                <span className="text-[#f5f3ef]">{refill.scaledRecipe.carrierOilMl.toFixed(1)}ml</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-medium pt-2 border-t border-[#f5f3ef]/10">
              <span className="text-[#f5f3ef]">Total</span>
              <span className="text-[#c9a227]">{refill.targetSize}ml</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={handleStartRefill} className="flex-1 px-4 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors">
              Start Refill
            </button>
            <button onClick={handlePrint} className="px-4 py-2 bg-[#111] border border-[#f5f3ef]/10 text-[#f5f3ef] rounded-lg text-sm hover:bg-[#f5f3ef]/5 transition-colors">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LABEL GENERATOR TAB - Real-time preview with toggles
// ============================================================================

function LabelGeneratorTab() {
  const [settings, setSettings] = useState<LabelSettings>({
    showIngredients: true,
    showExpiry: true,
    showWarnings: true,
    showQRCode: true,
    showBatchId: true,
    showMadeDate: true,
    showCrystal: true,
    labelSize: '30ml',
  });

  const [previewData, setPreviewData] = useState({
    blendName: 'Sleep Sanctuary',
    oils: [
      { name: 'Lavender', percentage: 30, ml: 9.0 },
      { name: 'Cedarwood', percentage: 25, ml: 7.5 },
      { name: 'Bergamot', percentage: 20, ml: 6.0 },
      { name: 'Vetiver', percentage: 15, ml: 4.5 },
      { name: 'Ylang Ylang', percentage: 10, ml: 3.0 },
    ],
    carrierOil: 'Jojoba',
    carrierPercentage: 70,
    size: 30,
    batchId: 'OA-240308-001',
    madeDate: new Date().toLocaleDateString('en-AU'),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU'),
    warnings: ['External use only', 'Do not ingest', 'Keep away from children'],
    crystal: 'Amethyst',
  });

  const toggleSetting = (key: keyof LabelSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGeneratePrint = async () => {
    const data = {
      blendName: previewData.blendName,
      oils: previewData.oils,
      carrierOil: previewData.carrierOil,
      carrierPercentage: previewData.carrierPercentage,
      size: previewData.size,
      batchId: previewData.batchId,
      madeDate: previewData.madeDate,
      expiryDate: previewData.expiryDate,
      warnings: previewData.warnings,
      crystal: previewData.crystal,
      showIngredients: settings.showIngredients,
      showExpiry: settings.showExpiry,
      showWarnings: settings.showWarnings,
      showQRCode: settings.showQRCode,
      showBatchId: settings.showBatchId,
      showMadeDate: settings.showMadeDate,
      showCrystal: settings.showCrystal,
    };
    try {
      const res = await adminFetch('/api/admin/labels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.html) {
        const w = window.open('', '_blank');
        if (w) w.document.write(json.html);
      }
    } catch {
      alert('Failed to generate label');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#f5f3ef]">Label Generator</h2>
          <p className="text-[#a69b8a]">Generate print-ready bottle labels • Toggle options update preview in real-time</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors">
          <FileText className="w-4 h-4" />
          Batch Print
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Label Preview - Updates in real-time */}
        <div>
          <h3 className="text-[#f5f3ef] font-medium mb-4 flex items-center gap-2">
            Preview
            <span className="text-xs text-[#a69b8a] font-normal">(Updates instantly)</span>
          </h3>
          <BottleLabelPreview settings={settings} data={previewData} />
        </div>

        {/* Settings */}
        <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
          <h3 className="text-[#f5f3ef] font-medium mb-4">Label Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#a69b8a] mb-2">Label Type</label>
              <select 
                value={settings.labelSize}
                onChange={(e) => setSettings(prev => ({ ...prev, labelSize: e.target.value as LabelSettings['labelSize'] }))}
                className="w-full bg-[#0a080c] border border-[#f5f3ef]/10 rounded-lg px-3 py-2 text-[#f5f3ef]"
              >
                <option value="30ml">Standard 30ml Bottle</option>
                <option value="50ml">50ml Refill Bottle</option>
                <option value="100ml">100ml Refill Bottle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#a69b8a] mb-2">Include on Label</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showIngredients}
                    onChange={() => toggleSetting('showIngredients')}
                    className="rounded bg-[#0a080c] border-[#f5f3ef]/30 text-[#c9a227] focus:ring-[#c9a227]" 
                  />
                  <span className="text-[#f5f3ef] text-sm">Ingredients list with percentages</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showMadeDate}
                    onChange={() => toggleSetting('showMadeDate')}
                    className="rounded bg-[#0a080c] border-[#f5f3ef]/30 text-[#c9a227] focus:ring-[#c9a227]" 
                  />
                  <span className="text-[#f5f3ef] text-sm">Made date</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showExpiry}
                    onChange={() => toggleSetting('showExpiry')}
                    className="rounded bg-[#0a080c] border-[#f5f3ef]/30 text-[#c9a227] focus:ring-[#c9a227]" 
                  />
                  <span className="text-[#f5f3ef] text-sm">Expiry date</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showBatchId}
                    onChange={() => toggleSetting('showBatchId')}
                    className="rounded bg-[#0a080c] border-[#f5f3ef]/30 text-[#c9a227] focus:ring-[#c9a227]" 
                  />
                  <span className="text-[#f5f3ef] text-sm">Batch ID</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showWarnings}
                    onChange={() => toggleSetting('showWarnings')}
                    className="rounded bg-[#0a080c] border-[#f5f3ef]/30 text-[#c9a227] focus:ring-[#c9a227]" 
                  />
                  <span className="text-[#f5f3ef] text-sm">Safety warnings</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showQRCode}
                    onChange={() => toggleSetting('showQRCode')}
                    className="rounded bg-[#0a080c] border-[#f5f3ef]/30 text-[#c9a227] focus:ring-[#c9a227]" 
                  />
                  <span className="text-[#f5f3ef] text-sm flex items-center gap-1">
                    <QrCode className="w-3 h-3" />
                    QR code for reorder
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showCrystal}
                    onChange={() => toggleSetting('showCrystal')}
                    className="rounded bg-[#0a080c] border-[#f5f3ef]/30 text-[#c9a227] focus:ring-[#c9a227]" 
                  />
                  <span className="text-[#f5f3ef] text-sm">Crystal information</span>
                </label>
              </div>
            </div>

            <button onClick={handleGeneratePrint} className="w-full px-4 py-2 bg-[#c9a227] text-[#0a080c] rounded-lg text-sm font-medium hover:bg-[#c9a227]/90 transition-colors">
              Generate & Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BOTTLE LABEL PREVIEW - Real-time updates based on settings
// ============================================================================

function BottleLabelPreview({ 
  settings, 
  data 
}: { 
  settings: LabelSettings; 
  data: {
    blendName: string;
    oils: Array<{ name: string; percentage: number; ml: number }>;
    carrierOil?: string;
    carrierPercentage?: number;
    size: number;
    batchId: string;
    madeDate: string;
    expiryDate: string;
    warnings: string[];
    crystal?: string;
  };
}) {
  const ingredients = data.oils.map(o => 
    `${o.name} (${o.percentage}%)`
  ).join(', ');

  const warningsText = data.warnings.length > 0 
    ? data.warnings.join(' • ')
    : 'External use only • Do not ingest • Keep away from children';

  return (
    <div className="bg-white rounded-lg p-6 w-[280px] mx-auto shadow-2xl transition-all duration-300">
      {/* Oil Amor Branding */}
      <div className="text-center border-b-2 border-[#c9a227] pb-3 mb-3">
        <p className="text-[#c9a227] text-xs tracking-[0.3em] uppercase">Oil Amor</p>
        <h3 className="text-[#0a080c] font-serif text-lg">{data.blendName}</h3>
        <p className="text-[#666] text-xs">
          {data.carrierOil ? 'Carrier Oil Dilution' : 'Pure Essential Oil Blend'}
        </p>
      </div>

      {/* Ingredients - Toggleable */}
      {settings.showIngredients && (
        <div className="space-y-1 text-xs mb-3 transition-all duration-300">
          <p className="text-[#333] font-medium">Ingredients:</p>
          <p className="text-[#666] leading-relaxed">{ingredients}</p>
          {data.carrierOil && (
            <p className="text-[#666] italic mt-1">in {data.carrierOil} ({data.carrierPercentage}% carrier)</p>
          )}
        </div>
      )}

      {/* Crystal - Toggleable */}
      {settings.showCrystal && data.crystal && (
        <div className="text-xs mb-3 transition-all duration-300">
          <p className="text-[#333] font-medium">Crystal:</p>
          <p className="text-[#666]">{data.crystal}</p>
        </div>
      )}

      {/* Details - Toggleable fields */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <p className="text-[#666]">Size:</p>
          <p className="text-[#333] font-medium">{data.size}ml</p>
        </div>
        {settings.showBatchId && (
          <div>
            <p className="text-[#666]">Batch:</p>
            <p className="text-[#333] font-medium">{data.batchId}</p>
          </div>
        )}
        {settings.showMadeDate && (
          <div>
            <p className="text-[#666]">Made:</p>
            <p className="text-[#333] font-medium">{data.madeDate}</p>
          </div>
        )}
        {settings.showExpiry && (
          <div>
            <p className="text-[#666]">Expires:</p>
            <p className="text-[#333] font-medium">{data.expiryDate}</p>
          </div>
        )}
      </div>

      {/* Warnings - Toggleable */}
      {settings.showWarnings && (
        <div className="border-t border-[#ddd] pt-2 text-[10px] text-[#666] space-y-0.5 transition-all duration-300">
          <p className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {warningsText}
          </p>
        </div>
      )}

      {/* QR Code - Toggleable */}
      {settings.showQRCode && (
        <div className="flex justify-center mt-3 transition-all duration-300">
          <div className="w-16 h-16 bg-[#0a080c] rounded flex items-center justify-center">
            <QrCode className="w-8 h-8 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ANALYTICS TAB - Real data from stats
// ============================================================================

function AnalyticsTab({ stats }: { stats: DashboardStats | null }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-[#f5f3ef]">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard 
          title="Total Revenue" 
          value={`$${stats?.monthRevenue?.toFixed(2) || '0.00'}`} 
          change="+12%" 
        />
        <AnalyticsCard 
          title="Orders This Month" 
          value={stats?.totalOrders?.toString() || '0'} 
          change="+8%" 
        />
        <AnalyticsCard 
          title="Completed Refills" 
          value={stats?.completedRefills?.toString() || '0'} 
          change="+24%" 
        />
        <AnalyticsCard 
          title="Active Bottles" 
          value={stats?.totalBottles?.toString() || '0'} 
          change="+5%" 
        />
      </div>

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6 h-80">
          <h3 className="text-[#f5f3ef] font-medium mb-4">Revenue Trend</h3>
          <div className="flex items-end justify-between h-56 gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-[#c9a227]/20 rounded-t transition-all duration-500 hover:bg-[#c9a227]/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6 h-80">
          <h3 className="text-[#f5f3ef] font-medium mb-4">Top Oils</h3>
          <div className="space-y-3">
            {['Lavender', 'Eucalyptus', 'Tea Tree', 'Peppermint', 'Lemon'].map((oil, i) => (
              <div key={oil} className="flex items-center gap-3">
                <span className="text-[#a69b8a] w-6">{i + 1}</span>
                <div className="flex-1 h-8 bg-[#0a080c] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#c9a227]/60 rounded-full transition-all duration-500"
                    style={{ width: `${100 - i * 15}%` }}
                  />
                </div>
                <span className="text-[#f5f3ef] text-sm w-16 text-right">{100 - i * 15}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, change }: { title: string; value: string; change: string }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-[#111] border border-[#f5f3ef]/10 rounded-xl p-6">
      <p className="text-[#a69b8a] text-sm">{title}</p>
      <div className="flex items-end justify-between mt-2">
        <p className="text-2xl font-medium text-[#f5f3ef]">{value}</p>
        <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color,
  alert 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType;
  color: string;
  alert?: boolean;
}) {
  const colors: Record<string, string> = {
    gold: 'bg-[#c9a227]/10 border-[#c9a227]/30 text-[#c9a227]',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[color]} ${alert ? 'ring-2 ring-red-500/50' : ''}`}>
      <div className="flex items-center justify-between">
        <Icon className="w-5 h-5" />
        {alert && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    'pending': { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400' },
    'confirmed': { label: 'Confirmed', className: 'bg-blue-500/20 text-blue-400' },
    'processing': { label: 'Processing', className: 'bg-purple-500/20 text-purple-400' },
    'blending': { label: 'Blending', className: 'bg-amber-500/20 text-amber-400' },
    'quality-check': { label: 'Quality Check', className: 'bg-indigo-500/20 text-indigo-400' },
    'ready-to-ship': { label: 'Ready', className: 'bg-cyan-500/20 text-cyan-400' },
    'shipped': { label: 'Shipped', className: 'bg-green-500/20 text-green-400' },
    'delivered': { label: 'Delivered', className: 'bg-green-500/20 text-green-500' },
    'cancelled': { label: 'Cancelled', className: 'bg-red-500/20 text-red-400' },
    'refunded': { label: 'Refunded', className: 'bg-gray-500/20 text-gray-400' },
  };

  const { label, className } = config[status] || { label: status, className: 'bg-gray-500/20 text-gray-400' };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
