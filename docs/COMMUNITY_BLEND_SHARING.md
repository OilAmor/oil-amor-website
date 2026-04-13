# Community Blend Sharing Feature

## Overview

This feature allows users to share their custom blends from the Mixing Atelier to the Community Blends page after successful purchase.

## How It Works

### 1. User Creates a Blend (Mixing Atelier)

1. User selects oils, bottle size, cord, crystal, etc.
2. User names their blend (e.g., "My Sleep Potion")
3. User checks the **"🌟 Share to Community Blends"** checkbox
4. User clicks **"Add to Cart"**

### 2. Cart Storage

The `shareToCommunity` flag, along with creator info, is stored in the cart item's `customMix`:

```typescript
customMix: {
  recipeName: "My Sleep Potion",
  mode: "carrier",
  oils: [...],
  // ... other blend data
  shareToCommunity: true,
  creatorId: "user-123",
  creatorName: "Alexandra"
}
```

### 3. Checkout & Order Completion

When the user completes their purchase:

1. Order is created with the `shareToCommunity` flag preserved
2. `processCommunityBlendShares()` extracts blends marked for sharing
3. `createCommunityBlend()` is called to add the blend to the community database
4. The blend appears on the Community Blends page

### 4. User Feedback

After purchase completion, the user sees a toast notification:

> 🎉 Your blend "My Sleep Potion" has been shared to the Community Blends!

## Technical Implementation

### Files Modified

1. **`lib/db/schema/orders.ts`**
   - Added `shareToCommunity`, `creatorId`, `creatorName` to `OrderCustomMix` interface

2. **`app/(shop)/mixing-atelier/page.tsx`**
   - Updated `handleAddToCart` to include share flag and creator info when user checks the box

3. **`lib/orders/order-completion.ts`**
   - Added `extractCommunityBlendShares()` function
   - Added `processCommunityBlendShares()` function
   - Added `CommunityBlendShare` interface

4. **`lib/context/user-context.tsx`**
   - Added `customMix` property to `OrderItem` interface
   - Added `customerId` to `Order` interface

5. **`lib/hooks/use-order-completion.ts`** (NEW)
   - Hook for completing orders with community blend sharing
   - Provides `getCommunityShareToastMessage()` for user feedback

6. **`app/(shop)/mixing-atelier/page.tsx`** (UI)
   - Updated checkbox label to be clearer about post-purchase sharing

## Usage Example

```typescript
import { useOrderCompletion, getCommunityShareToastMessage } from '@/lib/hooks/use-order-completion'
import { useUser } from '@/lib/context/user-context'
import { useToast } from '@/lib/context/toast-context'

function CheckoutPage() {
  const { addOrder } = useUser()
  const { addToast } = useToast()
  
  const { completeOrder } = useOrderCompletion({
    onSuccess: (results) => {
      const { message, type } = getCommunityShareToastMessage(results)
      if (message) addToast(message, type)
    }
  })

  const handleCheckout = async (order: Order) => {
    await completeOrder(order, addOrder)
  }
}
```

## Flow Diagram

```
User creates blend in Mixing Atelier
       ↓
User checks "Share to Community" checkbox
       ↓
User clicks "Add to Cart"
       ↓
shareToCommunity flag stored in cart item
       ↓
User completes checkout
       ↓
Order created with share flag
       ↓
processCommunityBlendShares() extracts shareable blends
       ↓
createCommunityBlend() adds to community database
       ↓
Blend appears on Community Blends page
       ↓
User sees success toast notification
```

## Benefits of This Approach

1. **Quality Control**: Blends are only shared after purchase, ensuring they're real products
2. **Attribution**: Creator name is preserved and displayed on community blends
3. **User Control**: Users must explicitly opt-in to share (checkbox)
4. **Feedback**: Users get immediate confirmation when their blend is shared
5. **Professional**: Clean separation of concerns between cart, order, and community systems

## Future Enhancements

- Add blend analytics (views, favorites, purchases) for creators
- Email notification when someone purchases your shared blend
- Ability to edit or remove shared blends from creator dashboard
- Community blend moderation system
