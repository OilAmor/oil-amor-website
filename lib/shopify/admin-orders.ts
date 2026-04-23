/**
 * Shopify Admin API — Orders Integration
 * 
 * Fetches real orders from Shopify Admin REST API and transforms them
 * into the internal Order format used by the Oil Amor admin dashboard.
 * 
 * This is the PRIMARY data source for the admin dashboard. Local DB
 * orders are used as a cache/fallback only.
 */

import { env } from '@/env';
import type { Order, OrderLineItem, OrderCustomMix, OrderStatus, ShippingAddress } from '@/lib/db/schema/orders';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ADMIN_API_VERSION = env.SHOPIFY_ADMIN_API_VERSION || '2024-01';
const STORE_DOMAIN = env.SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

function getAdminBaseUrl(): string {
  const domain = STORE_DOMAIN.replace(/\.myshopify\.com$/, '');
  return `https://${domain}.myshopify.com/admin/api/${ADMIN_API_VERSION}`;
}

// ============================================================================
// API CLIENT
// ============================================================================

async function shopifyAdminRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${getAdminBaseUrl()}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Admin API error: ${response.status} ${response.statusText} — ${errorText.slice(0, 500)}`);
  }

  return response.json() as Promise<T>;
}

// ============================================================================
// ORDER FETCHING
// ============================================================================

interface ShopifyOrdersResponse {
  orders: ShopifyOrder[];
}

interface ShopifyOrder {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  closed_at: string | null;
  processed_at: string | null;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  total_discounts: string;
  currency: string;
  note: string | null;
  customer?: {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
  shipping_address?: ShopifyAddress;
  billing_address?: ShopifyAddress;
  line_items: ShopifyLineItem[];
  shipping_lines: ShopifyShippingLine[];
  fulfillments: ShopifyFulfillment[];
  tags: string;
}

interface ShopifyAddress {
  first_name: string;
  last_name: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string | null;
}

interface ShopifyLineItem {
  id: number;
  product_id: number | null;
  variant_id: number | null;
  title: string;
  variant_title: string | null;
  quantity: number;
  price: string;
  sku: string | null;
  grams: number;
  properties: { name: string; value: string }[];
  requires_shipping: boolean;
  fulfillable_quantity: number;
  fulfillment_status: string | null;
}

interface ShopifyShippingLine {
  title: string;
  price: string;
  code: string;
  source: string;
}

interface ShopifyFulfillment {
  id: number;
  tracking_number: string | null;
  tracking_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FetchOrdersOptions {
  status?: 'open' | 'closed' | 'cancelled' | 'any';
  financial_status?: 'authorized' | 'pending' | 'paid' | 'refunded' | 'voided' | 'any';
  fulfillment_status?: 'shipped' | 'partial' | 'unshipped' | 'any';
  created_at_min?: string; // ISO 8601
  created_at_max?: string;
  limit?: number;
  page_info?: string;
  fields?: string;
}

/**
 * Fetch orders from Shopify Admin API
 */
export async function fetchShopifyOrders(options: FetchOrdersOptions = {}): Promise<Order[]> {
  const params = new URLSearchParams();
  params.set('status', options.status || 'any');
  params.set('limit', String(Math.min(options.limit || 50, 250)));
  
  if (options.financial_status) params.set('financial_status', options.financial_status);
  if (options.fulfillment_status) params.set('fulfillment_status', options.fulfillment_status);
  if (options.created_at_min) params.set('created_at_min', options.created_at_min);
  if (options.created_at_max) params.set('created_at_max', options.created_at_max);
  if (options.page_info) {
    params.set('page_info', options.page_info);
    params.set('rel', 'next');
  }
  // Request fields needed for our Order type
  params.set('fields', 'id,name,email,created_at,updated_at,cancelled_at,closed_at,processed_at,financial_status,fulfillment_status,total_price,subtotal_price,total_tax,total_discounts,currency,note,customer,shipping_address,billing_address,line_items,shipping_lines,fulfillments,tags');

  const data = await shopifyAdminRequest<ShopifyOrdersResponse>(`/orders.json?${params.toString()}`);
  
  if (!data.orders) {
    console.warn('[Shopify Admin] No orders returned from API');
    return [];
  }

  return data.orders.map(transformShopifyOrderToInternal);
}

/**
 * Fetch a single order by Shopify order ID
 */
export async function fetchShopifyOrderById(shopifyOrderId: number | string): Promise<Order | null> {
  try {
    const data = await shopifyAdminRequest<{ order: ShopifyOrder }>(`/orders/${shopifyOrderId}.json`);
    if (!data.order) return null;
    return transformShopifyOrderToInternal(data.order);
  } catch (error) {
    console.error(`[Shopify Admin] Failed to fetch order ${shopifyOrderId}:`, error);
    return null;
  }
}

/**
 * Fetch recent orders (last N days)
 */
export async function fetchRecentShopifyOrders(days: number = 30, limit: number = 250): Promise<Order[]> {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - days);
  
  return fetchShopifyOrders({
    status: 'any',
    created_at_min: minDate.toISOString(),
    limit,
  });
}

/**
 * Fetch orders that contain custom mix / atelier products
 */
export async function fetchAtelierOrders(days: number = 90): Promise<Order[]> {
  const orders = await fetchRecentShopifyOrders(days, 250);
  return orders.filter(order => 
    order.items?.some(item => item.customMix || item.type === 'custom-mix')
  );
}

// ============================================================================
// TRANSFORMATION
// ============================================================================

function transformShopifyOrderToInternal(shopifyOrder: ShopifyOrder): Order {
  const items = shopifyOrder.line_items.map(transformLineItem);
  const hasCustomMix = items.some(item => item.customMix);
  
  const shippingAddress = transformAddress(shopifyOrder.shipping_address);
  const billingAddress = shopifyOrder.billing_address 
    ? transformAddress(shopifyOrder.billing_address) 
    : undefined;

  const status = mapShopifyStatus(
    shopifyOrder.financial_status,
    shopifyOrder.fulfillment_status,
    shopifyOrder.cancelled_at,
    hasCustomMix,
    items
  );

  const shippingLine = shopifyOrder.shipping_lines?.[0];
  const fulfillment = shopifyOrder.fulfillments?.[0];

  const subtotal = Math.round(parseFloat(shopifyOrder.subtotal_price || '0') * 100);
  const taxTotal = Math.round(parseFloat(shopifyOrder.total_tax || '0') * 100);
  const total = Math.round(parseFloat(shopifyOrder.total_price || '0') * 100);
  const discountTotal = Math.round(parseFloat(shopifyOrder.total_discounts || '0') * 100);
  const shippingTotal = shippingLine ? Math.round(parseFloat(shippingLine.price || '0') * 100) : 0;

  return {
    id: shopifyOrder.name || `SHOPIFY-${shopifyOrder.id}`,
    shopifyOrderId: String(shopifyOrder.id),
    customerId: shopifyOrder.customer?.id ? String(shopifyOrder.customer.id) : 'guest',
    customerEmail: shopifyOrder.customer?.email || shopifyOrder.email || '',
    customerName: `${shopifyOrder.customer?.first_name || ''} ${shopifyOrder.customer?.last_name || ''}`.trim() || 'Guest',
    isGuest: !shopifyOrder.customer,
    status,
    statusHistory: [{
      status,
      timestamp: shopifyOrder.created_at,
      note: `Imported from Shopify (financial: ${shopifyOrder.financial_status}, fulfillment: ${shopifyOrder.fulfillment_status || 'none'})`,
    }],
    items,
    subtotal,
    taxTotal,
    shippingTotal,
    discountTotal,
    storeCreditUsed: 0,
    giftCardUsed: 0,
    total,
    currency: shopifyOrder.currency || 'AUD',
    payment: {
      method: inferPaymentMethod(shopifyOrder),
      status: mapFinancialStatus(shopifyOrder.financial_status),
      paidAt: shopifyOrder.financial_status === 'paid' ? shopifyOrder.processed_at || shopifyOrder.created_at : undefined,
    },
    shippingAddress,
    billingAddress,
    shipping: {
      carrier: 'auspost',
      service: shippingLine?.title || 'Standard',
      cost: shippingTotal,
      trackingNumber: fulfillment?.tracking_number || undefined,
      trackingUrl: fulfillment?.tracking_url || undefined,
      shippedAt: fulfillment?.created_at || undefined,
    },
    isGift: shopifyOrder.tags?.includes('gift') || false,
    giftMessage: extractGiftMessage(shopifyOrder),
    giftReceipt: false,
    requiresBlending: hasCustomMix && status !== 'shipped' && status !== 'delivered' && status !== 'cancelled',
    blendingPriority: shopifyOrder.tags?.includes('rush') ? 'rush' : 'normal',
    eligibleForReturns: items.some(item => item.type === 'standard-oil' && item.name.toLowerCase().includes('30ml')),
    returnCreditsEarned: 0,
    returnCreditsUsed: 0,
    customerNote: shopifyOrder.note || undefined,
    internalNote: undefined,
    createdAt: shopifyOrder.created_at,
    updatedAt: shopifyOrder.updated_at,
  };
}

function transformLineItem(item: ShopifyLineItem): OrderLineItem {
  const properties = Object.fromEntries(
    item.properties?.map(p => [p.name, p.value]) || []
  );

  const customMix = extractCustomMix(properties, item);
  
  const unitPrice = Math.round(parseFloat(item.price || '0') * 100);
  const quantity = item.quantity || 1;
  const subtotal = unitPrice * quantity;
  const taxAmount = Math.round(subtotal * 0.1); // 10% GST
  const total = subtotal + taxAmount;

  // Determine line item type
  let type: OrderLineItem['type'] = 'standard-oil';
  if (customMix) type = 'custom-mix';
  else if (item.title.toLowerCase().includes('refill')) type = 'refill-oil';
  else if (item.title.toLowerCase().includes('crystal') || item.title.toLowerCase().includes('cord')) type = 'accessory';
  else if (item.title.toLowerCase().includes('gift card')) type = 'gift-card';
  else if (!item.requires_shipping) type = 'accessory';

  return {
    id: String(item.id),
    type,
    productId: item.product_id ? String(item.product_id) : undefined,
    variantId: item.variant_id ? String(item.variant_id) : undefined,
    sku: item.sku || undefined,
    name: item.title,
    description: item.variant_title || undefined,
    unitPrice,
    quantity,
    subtotal,
    taxAmount,
    total,
    customMix: customMix || undefined,
    isRefill: type === 'refill-oil',
    properties,
  };
}

/**
 * Extract custom mix data from Shopify line item properties
 * 
 * The atelier stores mix data as properties like:
 * - _mix_recipe_name
 * - _mix_mode (pure/carrier)
 * - _mix_oils (JSON array)
 * - _mix_carrier_ratio
 * - _mix_total_volume
 * - _mix_crystal_id
 * - _mix_safety_score
 * - _mix_safety_rating
 * - _mix_safety_warnings (JSON array)
 */
function extractCustomMix(
  properties: Record<string, string>,
  item: ShopifyLineItem
): OrderCustomMix | null {
  const recipeName = properties._mix_recipe_name || properties['Mix Name'] || properties['Recipe Name'];
  
  if (!recipeName && !properties._mix_oils) {
    // Also detect by product title
    if (!item.title.toLowerCase().includes('custom') && !item.title.toLowerCase().includes('atelier') && !item.title.toLowerCase().includes('blend')) {
      return null;
    }
  }

  let oils: OrderCustomMix['oils'] = [];
  
  if (properties._mix_oils) {
    try {
      const parsed = JSON.parse(properties._mix_oils);
      if (Array.isArray(parsed)) {
        oils = parsed.map((o: any) => ({
          oilId: o.id || o.oilId || String(o.name).toLowerCase().replace(/\s+/g, '-'),
          oilName: o.name || o.oilName || 'Unknown Oil',
          ml: typeof o.ml === 'number' ? o.ml : parseFloat(o.ml) || 0,
          percentage: typeof o.percentage === 'number' ? o.percentage : parseFloat(o.percentage) || 0,
        }));
      }
    } catch {
      // Invalid JSON, try comma-separated
    }
  }

  // Fallback: parse from individual properties
  if (oils.length === 0) {
    const oilKeys = Object.keys(properties).filter(k => k.startsWith('_oil_'));
    for (const key of oilKeys) {
      const oilName = key.replace('_oil_', '').replace(/-/g, ' ');
      const ml = parseFloat(properties[key]) || 0;
      if (ml > 0) {
        oils.push({
          oilId: key,
          oilName: oilName.charAt(0).toUpperCase() + oilName.slice(1),
          ml,
          percentage: 0, // Will be calculated
        });
      }
    }
  }

  // Calculate percentages if missing
  const totalMl = oils.reduce((sum, o) => sum + o.ml, 0);
  if (totalMl > 0) {
    oils = oils.map(o => ({
      ...o,
      percentage: o.percentage > 0 ? o.percentage : Math.round((o.ml / totalMl) * 1000) / 10,
    }));
  }

  const mode = (properties._mix_mode as 'pure' | 'carrier') || 
               (properties['Mix Mode'] as 'pure' | 'carrier') || 
               'pure';

  const totalVolume = parseInt(properties._mix_total_volume || properties['Bottle Size'] || '30') as 5 | 10 | 15 | 20 | 30 | 50 | 100;

  let safetyWarnings: string[] = [];
  if (properties._mix_safety_warnings) {
    try {
      safetyWarnings = JSON.parse(properties._mix_safety_warnings);
    } catch {
      safetyWarnings = [properties._mix_safety_warnings];
    }
  }

  return {
    recipeName: recipeName || item.title || 'Custom Blend',
    mode,
    oils,
    carrierRatio: properties._mix_carrier_ratio ? parseFloat(properties._mix_carrier_ratio) : undefined,
    carrierOilId: properties._mix_carrier_oil_id || undefined,
    totalVolume: [5, 10, 15, 20, 30].includes(totalVolume) ? totalVolume : 30,
    crystalId: properties._mix_crystal_id || properties['Crystal'] || undefined,
    cordId: properties._mix_cord_id || undefined,
    safetyScore: properties._mix_safety_score ? parseInt(properties._mix_safety_score) : 95,
    safetyRating: properties._mix_safety_rating || 'safe',
    safetyWarnings,
    labCertified: true,
  };
}

function transformAddress(address?: ShopifyAddress): ShippingAddress {
  if (!address) {
    return {
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      province: '',
      country: 'AU',
      zip: '',
    };
  }
  
  return {
    firstName: address.first_name || '',
    lastName: address.last_name || '',
    company: address.company || undefined,
    address1: address.address1 || '',
    address2: address.address2 || undefined,
    city: address.city || '',
    province: address.province || '',
    country: address.country || 'AU',
    zip: address.zip || '',
    phone: address.phone || undefined,
  };
}

function mapShopifyStatus(
  financialStatus: string,
  fulfillmentStatus: string | null,
  cancelledAt: string | null,
  hasCustomMix: boolean,
  items: OrderLineItem[]
): OrderStatus {
  if (cancelledAt) return 'cancelled';
  if (financialStatus === 'refunded') return 'refunded';
  if (financialStatus === 'voided') return 'cancelled';

  // Map fulfillment first
  if (fulfillmentStatus === 'fulfilled') return 'shipped';
  if (fulfillmentStatus === 'partial') return 'ready-to-ship';

  // Map financial status
  if (financialStatus === 'pending') return 'pending';
  if (financialStatus === 'authorized') return 'confirmed';

  // Paid but not fulfilled
  if (financialStatus === 'paid' || financialStatus === 'partially_paid') {
    if (hasCustomMix) return 'blending';
    return 'processing';
  }

  return 'pending';
}

function mapFinancialStatus(status: string): Order['payment']['status'] {
  const map: Record<string, Order['payment']['status']> = {
    pending: 'pending',
    authorized: 'authorized',
    paid: 'captured',
    partially_paid: 'captured',
    refunded: 'refunded',
    partially_refunded: 'partially-refunded',
    voided: 'failed',
  };
  return map[status] || 'pending';
}

function inferPaymentMethod(order: ShopifyOrder): Order['payment']['method'] {
  // Shopify doesn't always expose payment gateway names directly in REST
  // We can infer from tags or gateway field if available
  const gateway = (order as any).gateway?.toLowerCase() || '';
  
  if (gateway.includes('stripe')) return 'credit-card';
  if (gateway.includes('paypal')) return 'paypal';
  if (gateway.includes('afterpay')) return 'afterpay';
  if (gateway.includes('shopify_payments')) return 'credit-card';
  if (order.tags?.includes('gift-card')) return 'gift-card';
  
  return 'credit-card';
}

function extractGiftMessage(order: ShopifyOrder): string | undefined {
  // Look for gift message in note or properties
  if (order.note?.toLowerCase().includes('gift:')) {
    return order.note.replace(/gift:\s*/i, '').trim();
  }
  return undefined;
}

// ============================================================================
// AGGREGATION / STATS
// ============================================================================

export interface ShopifyOrderStats {
  totalOrders: number;
  totalRevenue: number; // in cents
  ordersByStatus: Record<string, number>;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  pendingBlending: number;
  pendingFulfillment: number;
  shippedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  averageOrderValue: number;
}

export async function fetchShopifyOrderStats(days: number = 30): Promise<ShopifyOrderStats> {
  const orders = await fetchRecentShopifyOrders(days, 250);
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setMonth(monthStart.getMonth() - 1);

  let totalRevenue = 0;
  let todayRevenue = 0;
  let weekRevenue = 0;
  let monthRevenue = 0;
  let pendingBlending = 0;
  let pendingFulfillment = 0;
  let shippedOrders = 0;
  let cancelledOrders = 0;
  let refundedOrders = 0;

  const ordersByStatus: Record<string, number> = {};

  for (const order of orders) {
    const orderDate = new Date(order.createdAt);
    const revenue = order.total;

    totalRevenue += revenue;
    
    if (orderDate >= todayStart) todayRevenue += revenue;
    if (orderDate >= weekStart) weekRevenue += revenue;
    if (orderDate >= monthStart) monthRevenue += revenue;

    ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;

    if (order.status === 'blending') pendingBlending++;
    if (order.status === 'processing' || order.status === 'confirmed') pendingFulfillment++;
    if (order.status === 'shipped' || order.status === 'delivered') shippedOrders++;
    if (order.status === 'cancelled') cancelledOrders++;
    if (order.status === 'refunded') refundedOrders++;
  }

  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return {
    totalOrders: orders.length,
    totalRevenue,
    ordersByStatus,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    pendingBlending,
    pendingFulfillment,
    shippedOrders,
    cancelledOrders,
    refundedOrders,
    averageOrderValue,
  };
}

// ============================================================================
// FULFILLMENT
// ============================================================================

interface CreateFulfillmentInput {
  orderId: number;
  locationId?: number;
  trackingNumber?: string;
  trackingCompany?: string;
  notifyCustomer?: boolean;
  lineItems?: { id: number; quantity: number }[];
}

/**
 * Create a fulfillment for a Shopify order
 */
export async function createShopifyFulfillment(input: CreateFulfillmentInput): Promise<boolean> {
  try {
    await shopifyAdminRequest(`/orders/${input.orderId}/fulfillments.json`, {
      method: 'POST',
      body: JSON.stringify({
        fulfillment: {
          location_id: input.locationId,
          tracking_number: input.trackingNumber,
          tracking_company: input.trackingCompany || 'Australia Post',
          notify_customer: input.notifyCustomer ?? true,
          line_items: input.lineItems,
        },
      }),
    });
    return true;
  } catch (error) {
    console.error(`[Shopify Admin] Failed to create fulfillment for order ${input.orderId}:`, error);
    return false;
  }
}

/**
 * Update order tags in Shopify
 */
export async function updateShopifyOrderTags(orderId: number, tags: string[]): Promise<boolean> {
  try {
    await shopifyAdminRequest(`/orders/${orderId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        order: {
          id: orderId,
          tags: tags.join(', '),
        },
      }),
    });
    return true;
  } catch (error) {
    console.error(`[Shopify Admin] Failed to update tags for order ${orderId}:`, error);
    return false;
  }
}

/**
 * Add a note to a Shopify order
 */
export async function addShopifyOrderNote(orderId: number, note: string): Promise<boolean> {
  try {
    await shopifyAdminRequest(`/orders/${orderId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        order: {
          id: orderId,
          note,
        },
      }),
    });
    return true;
  } catch (error) {
    console.error(`[Shopify Admin] Failed to add note to order ${orderId}:`, error);
    return false;
  }
}
