'use client'

import { ProductionQueueItem } from '@/lib/orders/types'
import { getStatusLabel } from '@/lib/orders/status-helpers'
import { Beaker, AlertTriangle, Clock, CheckCircle, Printer, ChevronRight } from 'lucide-react'

interface ProductionQueueProps {
  items: ProductionQueueItem[]
  loading: boolean
  onStartMixing: (orderId: string, itemId: string) => void
  onCompleteMixing: (orderId: string, itemId: string) => void
  onPrintLabel: (orderId: string, itemId: string) => void
}

export function ProductionQueue({ items, loading, onStartMixing, onCompleteMixing, onPrintLabel }: ProductionQueueProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4 h-48 animate-pulse" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Beaker className="w-12 h-12 mx-auto text-slate-600 mb-3" />
        <div className="text-slate-400 font-medium">No items in production queue</div>
        <div className="text-sm text-slate-500 mt-1">All blends are mixed and ready!</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ProductionCard
          key={`${item.orderId}-${item.itemId}`}
          item={item}
          onStart={() => onStartMixing(item.orderId, item.itemId)}
          onComplete={() => onCompleteMixing(item.orderId, item.itemId)}
          onPrintLabel={() => onPrintLabel(item.orderId, item.itemId)}
        />
      ))}
    </div>
  )
}

function ProductionCard({
  item,
  onStart,
  onComplete,
  onPrintLabel,
}: {
  item: ProductionQueueItem
  onStart: () => void
  onComplete: () => void
  onPrintLabel: () => void
}) {
  const oilCount = item.oils?.length || 0
  const topOils = item.oils?.slice(0, 3) || []
  const remainingOils = Math.max(0, oilCount - 3)

  const getStatusIcon = () => {
    switch (item.status) {
      case 'confirmed':
        return <Clock className="w-4 h-4 text-blue-400" />
      case 'blending':
        return <Beaker className="w-4 h-4 text-amber-400" />
      case 'quality-check':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100 line-clamp-1">{item.blendName}</h3>
            {item.priority === 'rush' && (
              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 text-[10px] rounded-full font-medium">
                RUSH
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {getStatusIcon()}
            <span className="text-xs text-slate-400">{getStatusLabel(item.status as any)}</span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-500">{item.customerName}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-200">{item.bottleSize}ml</div>
          <div className="text-[10px] text-slate-500 uppercase">{item.mode || 'pure'}</div>
        </div>
      </div>

      {/* Oils */}
      <div className="space-y-1.5 mb-3">
        {topOils.map((oil, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-slate-300">{oil.oilName}</span>
            <span className="text-slate-500 font-mono">{oil.ml.toFixed(1)}ml</span>
          </div>
        ))}
        {remainingOils > 0 && (
          <div className="text-xs text-slate-500">+{remainingOils} more oils</div>
        )}
      </div>

      {/* Safety */}
      {item.safetyWarnings && item.safetyWarnings.length > 0 && (
        <div className="mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] text-amber-400">
            {item.safetyWarnings.length} warning{item.safetyWarnings.length > 1 ? 's' : ''}
          </span>
          <span className="text-[10px] text-slate-600">•</span>
          <span className="text-[10px] text-slate-500">Score: {item.safetyScore}</span>
        </div>
      )}

      {/* Crystal / Cord */}
      {(item.crystal || item.cord) && (
        <div className="flex gap-2 mb-3">
          {item.crystal && (
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">💎 {item.crystal}</span>
          )}
          {item.cord && (
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">🔗 {item.cord}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-700/30">
        {item.status === 'confirmed' && (
          <button
            onClick={onStart}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/30 text-amber-300 rounded-lg text-xs font-medium transition-colors"
          >
            <Beaker className="w-3.5 h-3.5" />
            Start Mixing
          </button>
        )}

        {item.status === 'blending' && (
          <button
            onClick={onComplete}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-300 rounded-lg text-xs font-medium transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Complete
          </button>
        )}

        <button
          onClick={onPrintLabel}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 rounded-lg text-xs font-medium transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          Label
        </button>
      </div>

      {/* Order Link */}
      <div className="mt-2 text-right">
        <span className="text-[10px] text-slate-600 font-mono">{item.orderId}</span>
      </div>
    </div>
  )
}
