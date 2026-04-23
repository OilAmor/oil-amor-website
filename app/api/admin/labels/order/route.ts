/**
 * Order-Based Label Generation API
 * 
 * Generates a bottle label directly from an order ID.
 * Fetches the order from Shopify (or local DB), extracts custom mix data,
 * looks up oil safety profiles, and generates a complete label.
 * 
 * POST /api/admin/labels/order
 * Body: { orderId: string, batchId?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { fetchShopifyOrderById } from '@/lib/shopify/admin-orders';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema-refill';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { orderId, batchId: customBatchId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Try to find the order — Shopify first, then local DB
    let order = null;
    
    // If orderId looks like a Shopify order number (e.g., #1001), try fetching from Shopify
    if (orderId.startsWith('#') || orderId.startsWith('SHOPIFY-')) {
      const numericId = orderId.replace('#', '').replace('SHOPIFY-', '');
      try {
        order = await fetchShopifyOrderById(numericId);
      } catch {
        // Shopify fetch failed, fall through to local DB
      }
    }

    // Fallback to local DB
    if (!order) {
      const localOrder = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
      });
      if (localOrder) {
        // Convert local DB order to Order format
        order = {
          id: localOrder.id,
          shopifyOrderId: localOrder.metadata?.shopifyOrderId,
          customerName: localOrder.customerName,
          customerEmail: localOrder.customerEmail,
          items: (localOrder.items || []).map((item: any) => ({
            ...item,
            unitPrice: item.unitPrice / 100,
            subtotal: item.subtotal / 100,
            taxAmount: item.taxAmount / 100,
            total: item.total / 100,
          })),
          shippingAddress: localOrder.shippingAddress,
          status: localOrder.status,
          createdAt: localOrder.createdAt.toISOString(),
        };
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Find the custom mix item
    const mixItem = order.items?.find((item: any) => item.customMix);
    
    if (!mixItem?.customMix) {
      return NextResponse.json({ 
        error: 'No custom mix found in this order',
        orderId: order.id,
      }, { status: 400 });
    }

    const mix = mixItem.customMix;
    
    // Generate batch ID if not provided
    const dateSuffix = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const batchId = customBatchId || `OA-${dateSuffix}-${nanoid(4).toUpperCase()}`;
    
    // Build the label data
    const labelData = {
      blendName: mix.recipeName || 'Custom Blend',
      oils: mix.oils.map((o: any) => ({
        name: o.oilName,
        percentage: o.percentage,
        ml: o.ml,
        oilId: o.oilId,
      })),
      carrierOil: mix.mode === 'carrier' ? (mix.carrierOilId || 'Jojoba Oil') : undefined,
      carrierPercentage: mix.mode === 'carrier' ? mix.carrierRatio : undefined,
      size: mix.totalVolume || 30,
      batchId,
      madeDate: new Date().toLocaleDateString('en-AU'),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU'),
      warnings: mix.safetyWarnings || [],
      crystal: mix.crystalId,
      intendedUse: mix.intendedUse,
      qrUrl: `https://oilamor.com/batch/${encodeURIComponent(batchId)}`,
      showIngredients: true,
      showExpiry: true,
      showWarnings: true,
      showQRCode: true,
      showBatchId: true,
      showMadeDate: true,
      showCrystal: true,
      showSafetyIcons: true,
    };

    // Call the label generator
    const labelResponse = await fetch(new URL('/api/admin/labels/generate', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(labelData),
    });

    if (!labelResponse.ok) {
      const err = await labelResponse.json();
      throw new Error(err.error || 'Label generation failed');
    }

    const labelResult = await labelResponse.json();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      batchId,
      ...labelResult,
    });

  } catch (error) {
    console.error('[Order Label] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate order label', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
