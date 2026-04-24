'use client'

import { useState } from 'react'
import { EnrichedOrder, OrderItemType } from '@/lib/orders/types'
import { getStatusLabel, getStatusColor } from '@/lib/orders/status-workflow'
import { Search, Filter, ChevronRight, Beaker, Printer, Truck, Package } from 'lucide-react'

const TYPE_BADGES: Record<OrderItemType, { label: string; color: string }> = {
  custom_blend: { label: 'Custom', color: 'bg-purple-500/20 text-purple-300' },
  collection_blend: { label: 'Collection', color: 'bg-indigo-500/20 text-indigo-300' },
  community_blend: { label: 'Community', color: 'bg-pink-500/20 text-pink-300' },
  pure_oil: { label: 'Pure Oil', color: 'bg-emerald-500/20 text-emerald-300' },
  carrier_oil: { label: 'Carrier', color: 'bg-teal-500/20 text-teal-300' },
  crystal: { label: 'Crystal', color: 'bg-cyan-500/20 text-cyan-300' },
  cord_charm: { label: 'Accessory', color: 'bg-slate-500/20 text-slate-300' },
  refill: { label: 'Refill', color: 'bg-amber-500/20 text-amber-300' },
  forever_bottle: { label: 'Bottle', color: 'bg-blue-500/20 text-blue-300' },
  gift_card: { label: 'Gift Card', color: 'bg-rose-500/20 text-rose-300' },
  shipping: { label: 'Shipping', color: 'bg-gray-500/20 text-gray-300' },
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  processing: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  blending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'quality-check': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'ready-to-ship': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  shipped: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  delivered: 'bg-green-500/20 text-green-300 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  refunded: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
}

interface OrderListProps {
  orders: EnrichedOrder[]
  loading: boolean
  onSelectOrder: (order: EnrichedOrder) => void
  onPrintLabel: (order: EnrichedOrder) => void
}

export function OrderList({ orders, loading, onSelectOrder, onPrintLabel }: OrderListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filtered = orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesType = typeFilter === 'all' || order.items.some((i) => i.type === typeFilter)

    return matchesSearch && matchesStatus && matchesType
  })

  const getPrimaryType = (order: EnrichedOrder): OrderItemType => {
    const type = order.items.find((i) => i.type !== 'shipping')?.type || 'pure_oil'
    return type as OrderItemType
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, customers, blends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="blending">Mixing</option>
          <option value="quality-check">Quality Check</option>
          <option value="ready-to-ship">Ready to Ship</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
        >
          <option value="all">All Types</option>
          <option value="custom_blend">Custom Blend</option>
          <option value="collection_blend">Collection</option>
          <option value="community_blend">Community</option>
          <option value="refill">Refill</option>
          <option value="pure_oil">Pure Oil</option>
        </select>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'needs-mixing', label: 'Needs Mixing', icon: Beaker, filter: (o: EnrichedOrder) => o.status === 'confirmed' || o.status === 'blending' },
          { key: 'needs-labels', label: 'Needs Labels', icon: Printer, filter: (o: EnrichedOrder) => o.status === 'quality-check' },
          { key: 'needs-dispatch', label: 'Needs Dispatch', icon: Truck, filter: (o: EnrichedOrder) => o.status === 'ready-to-ship' },
        ].map((qf) => {
          const count = orders.filter(qf.filter).length
          return (
            <button
              key={qf.key}
              onClick={() => {
                if (qf.key === 'needs-mixing') setStatusFilter('confirmed')
                if (qf.key === 'needs-labels') setStatusFilter('quality-check')
                if (qf.key === 'needs-dispatch') setStatusFilter('ready-to-ship')
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs text-slate-300 hover:bg-slate-700/60 transition-colors"
            >
              <qf.icon className="w-3.5 h-3.5" />
              {qf.label}
              <span className="bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Items</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-4">
                      <div className="h-10 bg-slate-800/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const primaryType = getPrimaryType(order)
                  const typeBadge = TYPE_BADGES[primaryType] || TYPE_BADGES.pure_oil

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => onSelectOrder(order)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs text-slate-300">{order.id}</div>
                        {order.requiresBlending && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                            <Beaker className="w-3 h-3" />
                            Needs blending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-200 font-medium">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${typeBadge.color}`}>
                          {typeBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-300 text-xs">
                          {order.items.filter((i) => i.type !== 'shipping').length} items
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                          {order.items.map((i) => i.name).join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-200 font-mono">${order.total.toFixed(2)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            STATUS_COLORS[order.status] || STATUS_COLORS.pending
                          }`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-AU', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {order.requiresBlending && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onPrintLabel(order)
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 transition-colors"
                              title="Print Label"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-700/50 text-xs text-slate-500">
            Showing {filtered.length} of {orders.length} orders
          </div>
        )}
      </div>
    </div>
  )
}
