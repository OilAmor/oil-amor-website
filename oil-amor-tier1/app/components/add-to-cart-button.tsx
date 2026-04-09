'use client'

import { useState } from 'react'
import { useCart } from '../hooks/use-cart'
import { Check, Loader2 } from 'lucide-react'

interface Props {
  merchandiseId: string
  available: boolean
}

export function AddToCartButton({ merchandiseId, available }: Props) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleClick = async () => {
    if (!available) return
    
    setIsAdding(true)
    await addItem({ productId: merchandiseId, quantity: 1 })
    setIsAdding(false)
    setIsAdded(true)
    
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (!available) {
    return (
      <button
        disabled
        className="w-full py-4 bg-gray-200 text-gray-400 text-sm uppercase tracking-wide font-medium cursor-not-allowed"
      >
        Sold Out
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isAdding || isAdded}
      className={`w-full py-4 text-sm uppercase tracking-wide font-medium transition-all duration-300 magnetic flex items-center justify-center gap-2 ${
        isAdded
          ? 'bg-green-700 text-white'
          : 'bg-miron-void text-white hover:bg-gold-pure hover:text-miron-void'
      }`}
      data-cursor="add"
    >
      {isAdding ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <Check className="w-4 h-4" />
          Added to Cart
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  )
}
