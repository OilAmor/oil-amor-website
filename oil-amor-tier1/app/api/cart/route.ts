/**
 * Cart API Route
 * Handles cart operations with cord/charm attachments
 */

import { NextRequest, NextResponse } from 'next/server'
import { cartManager } from '@/lib/cart/cart-manager-enhanced'
import { getOilSafetyProfile } from '@/lib/safety'

// ============================================================================
// GET /api/cart - Get cart by ID
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')
    
    // If no cartId provided, create a new cart
    if (!cartId) {
      const cart = await cartManager.createCart()
      return NextResponse.json({ cart }, { status: 201 })
    }
    
    const cart = await cartManager.getCart(cartId)
    
    // If cart not found or expired, create a new one
    if (!cart) {
      const cart = await cartManager.createCart()
      return NextResponse.json({ cart }, { status: 201 })
    }
    
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST /api/cart - Create new cart or add item
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    // Create new cart
    if (action === 'create') {
      const { customerId, email } = body
      const cart = await cartManager.createCart(customerId, email)
      return NextResponse.json({ cart }, { status: 201 })
    }
    
    // Add item to cart
    if (action === 'add') {
      const { cartId, product, quantity, attachment, customMix, configuration, properties } = body
      
      if (!cartId || !product) {
        return NextResponse.json(
          { error: 'Cart ID and product are required' },
          { status: 400 }
        )
      }
      
      // Validate attachment if provided
      if (attachment) {
        const validation = validateAttachment(attachment)
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          )
        }
      }
      
      // Validate custom mix if provided
      if (customMix) {
        const validation = validateCustomMix(customMix)
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          )
        }
      }
      
      const result = await cartManager.addItem(
        cartId,
        {
          productId: product.id,
          variantId: product.variantId,
          quantity: quantity || 1,
          attachment,
          customMix,
          configuration,
          properties,
        },
        {
          name: product.name,
          price: product.price,
          image: product.image,
          sku: product.sku,
        }
      )
      
      return NextResponse.json({ 
        cart: result.cart, 
        item: result.item 
      })
    }
    
    // Update item
    if (action === 'update') {
      const { cartId, lineId, quantity, attachment } = body
      
      if (!cartId || !lineId) {
        return NextResponse.json(
          { error: 'Cart ID and line ID are required' },
          { status: 400 }
        )
      }
      
      const cart = await cartManager.updateItem(cartId, { lineId, quantity, attachment })
      return NextResponse.json({ cart })
    }
    
    // Remove item
    if (action === 'remove') {
      const { cartId, lineId } = body
      
      if (!cartId || !lineId) {
        return NextResponse.json(
          { error: 'Cart ID and line ID are required' },
          { status: 400 }
        )
      }
      
      const cart = await cartManager.removeItem(cartId, lineId)
      return NextResponse.json({ cart })
    }
    
    // Update attachment only
    if (action === 'update-attachment') {
      const { cartId, lineId, attachment } = body
      
      if (!cartId || !lineId || !attachment) {
        return NextResponse.json(
          { error: 'Cart ID, line ID, and attachment are required' },
          { status: 400 }
        )
      }
      
      const validation = validateAttachment(attachment)
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        )
      }
      
      const cart = await cartManager.updateAttachment(cartId, lineId, attachment)
      return NextResponse.json({ cart })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

function validateAttachment(attachment: any): { valid: boolean; error?: string } {
  if (!attachment.type) {
    return { valid: false, error: 'Attachment type is required' }
  }
  
  if (attachment.type === 'cord' && !attachment.cordId) {
    return { valid: false, error: 'Cord ID is required for cord attachment' }
  }
  
  if (attachment.type === 'charm' && !attachment.isMysteryCharm && !attachment.charmId) {
    return { valid: false, error: 'Charm ID or mystery selection is required' }
  }
  
  return { valid: true }
}

function validateCustomMix(mix: any): { valid: boolean; error?: string } {
  if (!mix.recipeName) {
    return { valid: false, error: 'Mix name is required' }
  }
  
  if (!mix.oils || !Array.isArray(mix.oils) || mix.oils.length === 0) {
    return { valid: false, error: 'Mix must contain at least one oil' }
  }
  
  if (mix.oils.length > 5) {
    return { valid: false, error: 'Mix cannot contain more than 5 oils' }
  }
  
  // Validate each oil
  for (const oil of mix.oils) {
    if (!oil.oilId) {
      return { valid: false, error: 'Oil ID is required for each oil' }
    }
    // Accept either drops OR ml (drops takes precedence if both present)
    const hasValidDrops = oil.drops && oil.drops >= 1
    const hasValidMl = oil.ml && oil.ml > 0
    if (!hasValidDrops && !hasValidMl) {
      return { valid: false, error: 'Valid drop count or ml amount is required for each oil' }
    }
    
    // Check if oil exists in safety database
    const profile = getOilSafetyProfile(oil.oilId)
    if (!profile) {
      return { valid: false, error: `Oil ${oil.oilId} not found` }
    }
  }
  
  if (mix.mode === 'carrier') {
    if (mix.carrierRatio === undefined || mix.carrierRatio < 5 || mix.carrierRatio > 75) {
      return { valid: false, error: 'Carrier ratio must be between 5% and 75%' }
    }
  }
  
  return { valid: true }
}
