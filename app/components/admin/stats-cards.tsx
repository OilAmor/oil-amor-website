'use client'

import { Package, Beaker, Truck, DollarSign, AlertTriangle, Users } from 'lucide-react'

interface Stats {
  totalOrders: number
  pendingOrders: number
  mixingOrders: number
  readyOrders: number
  shippedOrders: number
  todayRevenue: number
  weekRevenue: number
  monthRevenue: number
  averageOrderValue: number
  totalCommissions: number
  pendingCommissions: number
  lowStockItems: string[]
}

export function StatsCards({ stats, loading }: { stats: Stats; loading: boolean }) {
  const cards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Pending / Mixing',
      value: stats.pendingOrders + stats.mixingOrders,
      icon: Beaker,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Ready to Ship',
      value: stats.readyOrders,
      icon: Truck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Shipped',
      value: stats.shippedOrders,
      icon: Truck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
    },
    {
      label: 'Month Revenue',
      value: `$${stats.monthRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
    {
      label: 'Avg Order Value',
      value: `$${stats.averageOrderValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">{card.label}</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {loading ? (
              <div className="h-8 w-20 bg-slate-700/50 rounded animate-pulse" />
            ) : (
              card.value
            )}
          </div>
        </div>
      ))}

      {stats.lowStockItems.length > 0 && (
        <div className="col-span-2 md:col-span-3 lg:col-span-6 bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm text-amber-200">
            <strong>Low Stock:</strong>{' '}
            {stats.lowStockItems.join(', ')}
          </span>
        </div>
      )}
    </div>
  )
}
