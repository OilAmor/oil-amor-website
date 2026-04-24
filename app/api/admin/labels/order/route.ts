/**
 * Order-Based Label Generation API — v3
 *
 * Generates a wrap-around bottle label directly from an order ID.
 * Auto-detects bottle size, handles refills, and looks up safety data.
 *
 * POST /api/admin/labels/order
 * Body: { orderId: string, batchId?: string, isRefill?: boolean, targetSize?: number }
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
    const { orderId, batchId: customBatchId, isRefill, targetSize } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Try to find the order — Shopify first, then local DB
    let order = null;

    if (orderId.startsWith('#') || orderId.startsWith('SHOPIFY-')) {
      const numericId = orderId.replace('#', '').replace('SHOPIFY-', '');
      try {
        order = await fetchShopifyOrderById(numericId);
      } catch {
        // Fall through
      }
    }

    if (!order) {
      const localOrder = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
      });
      if (localOrder) {
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
          isRefill: localOrder.metadata?.isRefill || false,
          sourceVolume: localOrder.metadata?.sourceVolume,
        };
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const mixItem = order.items?.find((item: any) => item.customMix);

    if (!mixItem?.customMix) {
      return NextResponse.json({
        error: 'No custom mix found in this order',
        orderId: order.id,
      }, { status: 400 });
    }

    const mix = mixItem.customMix;
    const size = targetSize || mix.totalVolume || 30;
    const dateSuffix = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const batchId = customBatchId || `OA-${dateSuffix}-${nanoid(4).toUpperCase()}`;

    // Build label data
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
      size,
      batchId,
      madeDate: new Date().toLocaleDateString('en-AU'),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU'),
      warnings: mix.safetyWarnings || [],
      crystal: mix.crystalId,
      cord: mix.cordId,
      intendedUse: mix.intendedUse,
      isRefill: isRefill || (order as any).isRefill || false,
      sourceVolume: (order as any).sourceVolume || mix.totalVolume,
      orderId: order.id,
      shopifyOrderId: order.shopifyOrderId,
      customerName: order.customerName,
    };

    const res = await fetch(new URL('/api/admin/labels/generate', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(labelData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Label generation failed' }));
      throw new Error(err.error);
    }

    const result = await res.json();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      batchId,
      ...result,
    });

  } catch (error) {
    console.error('[Order Label] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate order label', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
