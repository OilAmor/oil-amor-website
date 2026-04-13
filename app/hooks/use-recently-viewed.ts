'use client'

import { useEffect, useState } from 'react'

interface ViewedItem {
  id: string
  handle: string
  title: string
  price: string
  image: string | null
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<ViewedItem[]>([])

  useEffect(() => {
    const viewed = localStorage.getItem('recentlyViewed')
    if (viewed) {
      try {
        setItems(JSON.parse(viewed))
      } catch {
        setItems([])
      }
    }
  }, [])

  const addItem = (item: ViewedItem) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id)
      const updated = [item, ...filtered].slice(0, 8)
      localStorage.setItem('recentlyViewed', JSON.stringify(updated))
      return updated
    })
  }

  return { items, addItem }
}
