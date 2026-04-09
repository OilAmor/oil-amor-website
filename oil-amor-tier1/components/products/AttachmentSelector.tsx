'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Sparkles, 
  Info,
  AlertCircle
} from 'lucide-react'
import { 
  AttachmentSelection,
  AttachmentType,
  getDefaultAttachment,
  getAttachmentRecommendation,
  getAttachmentPrice,
  validateAttachment,
  CORD_OPTIONS,
  CHARM_OPTIONS,
} from '@/lib/products/attachment-options'
import { CordSelector } from './CordSelector'
import { CharmSelector } from './CharmSelector'
import { cn } from '@/lib/utils'

interface AttachmentSelectorProps {
  orderCount: number
  onSelectionChange: (selection: AttachmentSelection) => void
  className?: string
}

export function AttachmentSelector({ 
  orderCount, 
  onSelectionChange,
  className 
}: AttachmentSelectorProps) {
  const defaultAttachment = getDefaultAttachment(orderCount)
  // Use a default oilId since this component doesn't receive oilId as a prop
  const recommendation = getAttachmentRecommendation('default-oil', orderCount)
  
  const [selection, setSelection] = useState<AttachmentSelection>(defaultAttachment)
  const [activeTab, setActiveTab] = useState<AttachmentType>(defaultAttachment.type)
  const [error, setError] = useState<string | null>(null)
  
  // Update parent when selection changes
  useEffect(() => {
    const validation = validateAttachment(selection)
    if (validation.valid) {
      setError(null)
      onSelectionChange(selection)
    } else {
      setError(validation.errors[0] || 'Invalid selection')
    }
  }, [selection, onSelectionChange])
  
  const handleTabChange = (type: AttachmentType) => {
    setActiveTab(type)
    setSelection(prev => ({ ...prev, type }))
  }
  
  const handleCordSelect = (cordId: string) => {
    setSelection({
      type: 'cord',
      cordId,
      isMysteryCharm: false,
    })
  }
  
  const handleCharmSelect = (charmId: string) => {
    setSelection({
      type: 'charm',
      charmId,
      isMysteryCharm: false,
    })
  }
  
  const handleMysterySelect = () => {
    setSelection({
      type: 'charm',
      isMysteryCharm: true,
    })
  }
  
  const price = getAttachmentPrice(selection)
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h3 className="text-xl font-medium text-[#f5f3ef] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#c9a227]" />
          Forever Bottle Attachment
        </h3>
        <p className="text-sm text-[#a69b8a] mt-1">
          Each bottle comes with your choice of cord or charm
        </p>
      </div>
      
      {/* Smart Recommendation Banner */}
      <div className="p-4 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#c9a227] mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-[#f5f3ef]">Recommended Attachment</h4>
            <p className="text-sm text-[#a69b8a] mt-1">{recommendation.reason}</p>
          </div>
        </div>
      </div>
      
      {/* Tab Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTabChange('cord')}
          className={cn(
            'flex-1 p-4 rounded-xl border transition-all text-center',
            activeTab === 'cord'
              ? 'bg-[#c9a227]/10 border-[#c9a227]'
              : 'bg-[#111] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
          )}
        >
          <Package className={cn(
            'w-6 h-6 mx-auto mb-2',
            activeTab === 'cord' ? 'text-[#c9a227]' : 'text-[#a69b8a]'
          )} />
          <p className={cn(
            'font-medium',
            activeTab === 'cord' ? 'text-[#f5f3ef]' : 'text-[#a69b8a]'
          )}>
            Cord
          </p>
          <p className="text-xs text-[#a69b8a]">For carrying & hanging</p>
        </button>
        
        <button
          onClick={() => handleTabChange('charm')}
          className={cn(
            'flex-1 p-4 rounded-xl border transition-all text-center',
            activeTab === 'charm'
              ? 'bg-[#c9a227]/10 border-[#c9a227]'
              : 'bg-[#111] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
          )}
        >
          <Sparkles className={cn(
            'w-6 h-6 mx-auto mb-2',
            activeTab === 'charm' ? 'text-[#c9a227]' : 'text-[#a69b8a]'
          )} />
          <p className={cn(
            'font-medium',
            activeTab === 'charm' ? 'text-[#f5f3ef]' : 'text-[#a69b8a]'
          )}>
            Charm
          </p>
          <p className="text-xs text-[#a69b8a]">Crystal or symbol</p>
        </button>
      </div>
      
      {/* Selection Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'cord' && (
          <motion.div
            key="cord"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CordSelector
              selectedCordId={selection.cordId}
              onSelect={handleCordSelect}
            />
          </motion.div>
        )}
        
        {activeTab === 'charm' && (
          <motion.div
            key="charm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CharmSelector
              selectedCharmId={selection.charmId}
              isMysterySelected={selection.isMysteryCharm}
              onSelectCharm={handleCharmSelect}
              onSelectMystery={handleMysterySelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error Display */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}
      
      {/* Price Summary */}
      <div className="p-4 rounded-xl bg-[#111] border border-[#f5f3ef]/10">
        <div className="flex items-center justify-between">
          <span className="text-[#a69b8a]">Attachment</span>
          <span className="text-[#f5f3ef]">
            {selection.type === 'cord' && selection.cordId && (
              CORD_OPTIONS.find(c => c.id === selection.cordId)?.name
            )}
            {selection.type === 'charm' && selection.isMysteryCharm && 'Mystery Charm'}
            {selection.type === 'charm' && !selection.isMysteryCharm && selection.charmId && (
              CHARM_OPTIONS.find(c => c.id === selection.charmId)?.name
            )}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f5f3ef]/10">
          <span className="text-[#a69b8a]">Additional Cost</span>
          <span className={cn(
            'font-medium',
            price === 0 ? 'text-[#2ecc71]' : 'text-[#c9a227]'
          )}>
            {price === 0 ? 'Free' : `+$${price.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  )
}
