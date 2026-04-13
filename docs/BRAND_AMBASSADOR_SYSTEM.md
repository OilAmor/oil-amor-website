# Brand Ambassador System

## Overview

A complete brand ambassador and referral system that rewards users for sharing their custom blends.

## Features

### 1. **My Blends Library**
- Every blend purchased is automatically saved to the user's personal library
- Users can re-purchase their favorite blends with one click
- Blend history is persistent across sessions

### 2. **Unique Share Codes**
- Every blend gets a unique share code (e.g., `OIL-ABCD-1234`)
- Shareable URLs: `https://oilamor.com/mixing-atelier?ref=OIL-ABCD-1234`
- Codes are permanent and tied to the blend

### 3. **Referral Rewards**
- When someone purchases via a shared link, the referrer earns **10% credit**
- Credits are automatically applied to the referrer's account
- Credits can be used for future purchases

### 4. **Brand Ambassador Dashboard**
- View total blends created
- Track shares, views, and purchases
- Monitor credits earned
- See top-performing blends

## Flow Diagram

### Creating & Sharing a Blend

```
User creates blend in Mixing Atelier
       ↓
User purchases the blend
       ↓
Blend automatically saved to "My Blends"
       ↓
User clicks "Share" button
       ↓
Unique share code generated (OIL-ABCD-1234)
       ↓
Share URL copied to clipboard
       ↓
User shares on social media / with friends
```

### Referred Purchase Flow

```
Friend clicks shared link (?ref=OIL-ABCD-1234)
       ↓
Blend loads in Mixing Atelier with "Shared by [Creator]" badge
       ↓
Friend adds blend to cart and purchases
       ↓
Order completion triggers referral tracking
       ↓
Creator receives 10% of purchase amount as credit
       ↓
Creator gets notification: "You earned $3.50 credit!"
```

### Re-purchasing Your Own Blend

```
User visits Account → My Blends
       ↓
Sees list of all previously purchased blends
       ↓
Clicks "Re-purchase" on a blend
       ↓
Blend loads in Mixing Atelier with all settings restored
       ↓
User can modify or purchase as-is
```

## Technical Implementation

### Database Schema

**user_blends table:**
- Stores all blends created/purchased by users
- Includes share code, recipe data, stats
- Tracks brand ambassador metrics

**blend_referrals table:**
- Tracks every purchase made via share link
- Records credit amounts and status
- Enables fraud detection

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user-blends` | GET | Get user's blend library |
| `/api/user-blends` | POST | Save a new blend |
| `/api/user-blends/stats` | GET | Get brand ambassador stats |
| `/api/user-blends/share` | POST | Record a share event |
| `/api/user-blends/view` | POST | Record a view event |
| `/api/user-blends/by-code` | GET | Get blend by share code |

### Key Functions

**generateShareCode()**: Creates unique `OIL-XXXX-XXXX` codes

**saveBlendToLibrary()**: Saves blend after purchase

**trackReferral()**: Awards credits when purchases happen via share links

**getBrandAmbassadorStats()**: Dashboard data for users

## User Interface

### Mixing Atelier - Share Button

```tsx
<button onClick={handleShare}>
  <ShareIcon /> Share Blend
</button>
// Copies: "Check out my custom blend! https://oilamor.com/mixing-atelier?ref=OIL-ABCD-1234"
```

### Account Page - My Blends Section

```
┌─────────────────────────────────────────────┐
│ MY BLENDS                                   │
├─────────────────────────────────────────────┤
│                                             │
│ 🌙 Sleep Potion                    [Share] │
│    Purchased: Jan 15, 2026    [Re-purchase]│
│    Share Code: OIL-A1B2-C3D4                │
│    👁 45 views  |  💰 $12.50 earned         │
│                                             │
│ ✨ Energy Boost                    [Share] │
│    Purchased: Jan 10, 2026    [Re-purchase]│
│    Share Code: OIL-X9Y8-Z7W6                │
│    👁 128 views |  💰 $35.00 earned         │
│                                             │
└─────────────────────────────────────────────┘
```

### Brand Ambassador Dashboard

```
┌─────────────────────────────────────────────┐
│ BRAND AMBASSADOR STATS                      │
├─────────────────────────────────────────────┤
│                                             │
│  Total Blends:        12                    │
│  Total Shares:        47                    │
│  Total Views:         1,234                 │
│  Referral Purchases:  8                     │
│  Credits Earned:      $47.50                │
│                                             │
│  🏆 Top Performing Blends:                  │
│  1. Sleep Potion - $35.00 earned            │
│  2. Energy Boost - $12.50 earned            │
│                                             │
└─────────────────────────────────────────────┘
```

## Credit System

### Earning Credits
- 10% of every referred purchase goes to the referrer
- Credits are applied automatically
- No minimum threshold

### Using Credits
- Credits appear at checkout
- Can be applied to any purchase
- Never expire

### Example
```
Friend purchases $35.00 blend via your link
       ↓
You earn $3.50 credit (10%)
       ↓
Credit appears in your account instantly
       ↓
Use $3.50 off your next purchase
```

## Security Features

1. **Unique Share Codes**: 8-character alphanumeric codes, collision-resistant
2. **Fraud Detection**: IP tracking and user agent logging
3. **One-time Credits**: Each order can only generate credit once
4. **Self-referral Prevention**: Users can't earn credits from their own purchases

## Files Modified/Created

| File | Purpose |
|------|---------|
| `lib/db/schema/user-blends.ts` | Database schema for user blends and referrals |
| `lib/brand-ambassador/index.ts` | Core functions for sharing and referrals |
| `lib/hooks/use-user-blends.ts` | React hook for managing user blends |
| `lib/orders/order-completion.ts` | Updated to handle blend saving and referrals |
| `app/api/user-blends/*` | API routes for blend management |

## Future Enhancements

- [ ] Email notifications when someone purchases your blend
- [ ] Social media share buttons with preview images
- [ ] Leaderboard for top brand ambassadors
- [ ] Exclusive rewards for high-performing ambassadors
- [ ] Blend analytics (geographic data, peak times, etc.)
