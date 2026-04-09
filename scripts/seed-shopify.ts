#!/usr/bin/env tsx
// =============================================================================
// Shopify Product Seeding Script
// =============================================================================
// Syncs products to Shopify with variants for all bottle sizes
// Creates Forever Bottles, Essential Oils, and Accessories
// =============================================================================

import { config } from "dotenv";
import { shopifyAdminClient } from "../lib/shopify/admin-client";

config({ path: ".env.local" });

// =============================================================================
// Product Data
// =============================================================================

const FOREVER_BOTTLES = [
  {
    title: "Forever Bottle 10ml - Glass",
    handle: "forever-bottle-10ml-glass",
    description: "Our signature glass Forever Bottle with 6 refill credits included. A sustainable way to enjoy your essential oil blends.",
    price: 45.00,
    compareAtPrice: 75.00,
    tags: ["forever-bottle", "glass", "sustainable"],
    options: ["Size"],
    variants: [
      { title: "10ml", price: 45.00, sku: "FB-GLASS-10ML", weight: 50, weightUnit: "g" },
    ],
    metafields: {
      included_refills: 6,
      bottle_material: "Glass",
      sustainability_note: "Return for refills and save on future purchases",
    },
  },
  {
    title: "Forever Bottle 30ml - Glass",
    handle: "forever-bottle-30ml-glass",
    description: "Our medium-sized glass Forever Bottle with 6 refill credits. Perfect for daily use.",
    price: 75.00,
    compareAtPrice: 120.00,
    tags: ["forever-bottle", "glass", "sustainable", "bestseller"],
    options: ["Size"],
    variants: [
      { title: "30ml", price: 75.00, sku: "FB-GLASS-30ML", weight: 100, weightUnit: "g" },
    ],
    metafields: {
      included_refills: 6,
      bottle_material: "Glass",
      sustainability_note: "Return for refills and save on future purchases",
    },
  },
  {
    title: "Forever Bottle 50ml - Glass",
    handle: "forever-bottle-50ml-glass",
    description: "Our large glass Forever Bottle with 6 refill credits. Great value for committed oil enthusiasts.",
    price: 110.00,
    compareAtPrice: 185.00,
    tags: ["forever-bottle", "glass", "sustainable"],
    options: ["Size"],
    variants: [
      { title: "50ml", price: 110.00, sku: "FB-GLASS-50ML", weight: 150, weightUnit: "g" },
    ],
    metafields: {
      included_refills: 6,
      bottle_material: "Glass",
      sustainability_note: "Return for refills and save on future purchases",
    },
  },
  {
    title: "Forever Bottle 10ml - Sapphire Glass",
    handle: "forever-bottle-10ml-sapphire",
    description: "Premium sapphire glass Forever Bottle with 6 refill credits. UV-protective for precious oils.",
    price: 65.00,
    compareAtPrice: 110.00,
    tags: ["forever-bottle", "sapphire", "premium", "uv-protective"],
    options: ["Size"],
    variants: [
      { title: "10ml", price: 65.00, sku: "FB-SAPP-10ML", weight: 60, weightUnit: "g" },
    ],
    metafields: {
      included_refills: 6,
      bottle_material: "Sapphire Glass",
      sustainability_note: "Return for refills and save on future purchases",
    },
  },
  {
    title: "Forever Bottle 30ml - Sapphire Glass",
    handle: "forever-bottle-30ml-sapphire",
    description: "Premium sapphire glass Forever Bottle with 6 refill credits. The ultimate in oil preservation.",
    price: 95.00,
    compareAtPrice: 160.00,
    tags: ["forever-bottle", "sapphire", "premium", "uv-protective", "bestseller"],
    options: ["Size"],
    variants: [
      { title: "30ml", price: 95.00, sku: "FB-SAPP-30ML", weight: 110, weightUnit: "g" },
    ],
    metafields: {
      included_refills: 6,
      bottle_material: "Sapphire Glass",
      sustainability_note: "Return for refills and save on future purchases",
    },
  },
  {
    title: "Forever Bottle 50ml - Sapphire Glass",
    handle: "forever-bottle-50ml-sapphire",
    description: "Large premium sapphire glass Forever Bottle with 6 refill credits. Maximum protection for your blends.",
    price: 140.00,
    compareAtPrice: 235.00,
    tags: ["forever-bottle", "sapphire", "premium", "uv-protective"],
    options: ["Size"],
    variants: [
      { title: "50ml", price: 140.00, sku: "FB-SAPP-50ML", weight: 160, weightUnit: "g" },
    ],
    metafields: {
      included_refills: 6,
      bottle_material: "Sapphire Glass",
      sustainability_note: "Return for refills and save on future purchases",
    },
  },
];

const ESSENTIAL_OILS = [
  { name: "Lavender", price: 24.99, sku: "OIL-LAV-10ML", botanical: "Lavandula angustifolia", origin: "France" },
  { name: "Tea Tree", price: 19.99, sku: "OIL-TET-10ML", botanical: "Melaleuca alternifolia", origin: "Australia" },
  { name: "Eucalyptus", price: 18.99, sku: "OIL-EUC-10ML", botanical: "Eucalyptus globulus", origin: "Australia" },
  { name: "Peppermint", price: 22.99, sku: "OIL-PEP-10ML", botanical: "Mentha piperita", origin: "USA" },
  { name: "Lemon", price: 16.99, sku: "OIL-LEM-10ML", botanical: "Citrus limon", origin: "Italy" },
  { name: "Frankincense", price: 45.00, sku: "OIL-FRA-10ML", botanical: "Boswellia carterii", origin: "Somalia" },
  { name: "Bergamot", price: 28.99, sku: "OIL-BER-10ML", botanical: "Citrus bergamia", origin: "Italy" },
  { name: "Ylang Ylang", price: 32.99, sku: "OIL-YLA-10ML", botanical: "Cananga odorata", origin: "Madagascar" },
  { name: "Chamomile (Roman)", price: 55.00, sku: "OIL-CHR-10ML", botanical: "Anthemis nobilis", origin: "UK" },
  { name: "Rosemary", price: 17.99, sku: "OIL-ROS-10ML", botanical: "Rosmarinus officinalis", origin: "Spain" },
  { name: "Sandalwood", price: 85.00, sku: "OIL-SAN-10ML", botanical: "Santalum album", origin: "India" },
  { name: "Orange (Sweet)", price: 14.99, sku: "OIL-ORA-10ML", botanical: "Citrus sinensis", origin: "Brazil" },
];

const CRYSTAL_VIALS = [
  { name: "Amethyst Vial", price: 35.00, sku: "CV-AMETHYST", crystal: "Amethyst", properties: ["Intuition", "Peace", "Spiritual growth"] },
  { name: "Rose Quartz Vial", price: 32.00, sku: "CV-ROSEQUARTZ", crystal: "Rose Quartz", properties: ["Love", "Compassion", "Healing"] },
  { name: "Citrine Vial", price: 30.00, sku: "CV-CITRINE", crystal: "Citrine", properties: ["Abundance", "Confidence", "Joy"] },
  { name: "Clear Quartz Vial", price: 28.00, sku: "CV-CLEARQUARTZ", crystal: "Clear Quartz", properties: ["Clarity", "Amplification", "Healing"] },
];

const ACCESSORIES = [
  { name: "Natural Hemp Cord", price: 5.00, sku: "ACC-CORD-HEMP", category: "cord" },
  { name: "Black Waxed Cotton Cord", price: 6.00, sku: "ACC-CORD-BLACK", category: "cord" },
  { name: "Brown Leather Cord", price: 12.00, sku: "ACC-CORD-LEATHER", category: "cord" },
  { name: "Gold-Plated Chain", price: 18.00, sku: "ACC-CHAIN-GOLD", category: "cord" },
  { name: "Lotus Flower Charm", price: 8.00, sku: "ACC-CHARM-LOTUS", category: "charm" },
  { name: "Tree of Life Charm", price: 10.00, sku: "ACC-CHARM-TREE", category: "charm" },
  { name: "Moon Charm", price: 7.00, sku: "ACC-CHARM-MOON", category: "charm" },
  { name: "Heart Charm", price: 6.00, sku: "ACC-CHARM-HEART", category: "charm" },
];

const REFILL_CREDIT = {
  title: "Essential Oil Refill Credit",
  handle: "essential-oil-refill-credit",
  description: "One refill credit for your Forever Bottle. Use with any oil combination of your choice.",
  price: 12.00,
  tags: ["refill", "forever-bottle", "sustainable"],
  requires_bottle: true,
};

// =============================================================================
// Shopify API Functions
// =============================================================================

async function createOrUpdateProduct(productData: typeof FOREVER_BOTTLES[0]) {
  const query = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    title: productData.title,
    handle: productData.handle,
    descriptionHtml: productData.description,
    vendor: "Oil Amor",
    productType: productData.handle.includes("forever") ? "Forever Bottle" : 
                  productData.handle.includes("oil") ? "Essential Oil" : "Accessory",
    tags: productData.tags,
    options: productData.options?.map((name: string) => ({ name })) || [],
    variants: productData.variants.map((v: { title: string; price: number; sku: string; weight: number; weightUnit: string }) => ({
      title: v.title,
      price: v.price.toFixed(2),
      sku: v.sku,
      weight: v.weight,
      weightUnit: v.weightUnit,
      inventoryPolicy: "DENY",
      inventoryManagement: "SHOPIFY",
      requiresShipping: true,
    })),
  };

  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({ query, variables: { input } }),
    }
  );

  const data = await response.json();
  
  if (data.errors || data.data?.productCreate?.userErrors?.length > 0) {
    throw new Error(
      data.errors?.[0]?.message || 
      data.data?.productCreate?.userErrors?.[0]?.message ||
      "Unknown error"
    );
  }

  return data.data.productCreate.product;
}

async function createEssentialOilProduct(oil: typeof ESSENTIAL_OILS[0]) {
  const description = `
    <p><strong>Botanical Name:</strong> ${oil.botanical}</p>
    <p><strong>Origin:</strong> ${oil.origin}</p>
    <p><strong>Extraction Method:</strong> Steam distillation</p>
    <p>Premium grade ${oil.name} essential oil, perfect for creating your own custom blends.</p>
  `;

  const input = {
    title: `${oil.name} Essential Oil`,
    handle: `essential-oil-${oil.name.toLowerCase().replace(/\s+/g, "-")}`,
    descriptionHtml: description,
    vendor: "Oil Amor",
    productType: "Essential Oil",
    tags: ["essential-oil", oil.name.toLowerCase().replace(/\s+/g, "-")],
    variants: [{
      title: "10ml",
      price: oil.price.toFixed(2),
      sku: oil.sku,
      weight: 50,
      weightUnit: "g",
      inventoryPolicy: "DENY",
      inventoryManagement: "SHOPIFY",
      requiresShipping: true,
    }],
  };

  const query = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({ query, variables: { input } }),
    }
  );

  const data = await response.json();
  
  if (data.errors || data.data?.productCreate?.userErrors?.length > 0) {
    throw new Error(
      data.errors?.[0]?.message || 
      data.data?.productCreate?.userErrors?.[0]?.message ||
      `Failed to create ${oil.name}`
    );
  }

  return data.data.productCreate.product;
}

async function createAccessory(accessory: typeof ACCESSORIES[0]) {
  const input = {
    title: accessory.name,
    handle: `accessory-${accessory.sku.toLowerCase()}`,
    descriptionHtml: `<p>${accessory.name} for your Forever Bottle or Crystal Vial.</p>`,
    vendor: "Oil Amor",
    productType: accessory.category === "cord" ? "Cord" : "Charm",
    tags: ["accessory", accessory.category],
    variants: [{
      title: "Default",
      price: accessory.price.toFixed(2),
      sku: accessory.sku,
      weight: 10,
      weightUnit: "g",
      inventoryPolicy: "DENY",
      inventoryManagement: "SHOPIFY",
      requiresShipping: true,
    }],
  };

  const query = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({ query, variables: { input } }),
    }
  );

  const data = await response.json();
  
  if (data.errors || data.data?.productCreate?.userErrors?.length > 0) {
    throw new Error(
      data.errors?.[0]?.message || 
      data.data?.productCreate?.userErrors?.[0]?.message ||
      `Failed to create ${accessory.name}`
    );
  }

  return data.data.productCreate.product;
}

async function createRefillCreditProduct() {
  const input = {
    title: REFILL_CREDIT.title,
    handle: REFILL_CREDIT.handle,
    descriptionHtml: `<p>${REFILL_CREDIT.description}</p><p><strong>Note:</strong> Requires a registered Forever Bottle.</p>`,
    vendor: "Oil Amor",
    productType: "Refill Credit",
    tags: REFILL_CREDIT.tags,
    variants: [{
      title: "1 Credit",
      price: REFILL_CREDIT.price.toFixed(2),
      sku: "REFILL-CREDIT-1",
      inventoryPolicy: "CONTINUE",
      inventoryManagement: null,
      requiresShipping: true,
    }],
  };

  const query = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({ query, variables: { input } }),
    }
  );

  const data = await response.json();
  
  if (data.errors || data.data?.productCreate?.userErrors?.length > 0) {
    throw new Error(
      data.errors?.[0]?.message || 
      data.data?.productCreate?.userErrors?.[0]?.message ||
      "Failed to create refill credit product"
    );
  }

  return data.data.productCreate.product;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║            Shopify Product Seeding                           ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  // Validate environment
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.error("❌ Missing Shopify credentials. Check your .env.local file.");
    process.exit(1);
  }

  const results = {
    foreverBottles: 0,
    essentialOils: 0,
    crystalVials: 0,
    accessories: 0,
    refillCredit: false,
    errors: [] as string[],
  };

  try {
    // Create Forever Bottles
    console.log("Creating Forever Bottles...");
    for (const bottle of FOREVER_BOTTLES) {
      try {
        await createOrUpdateProduct(bottle);
        results.foreverBottles++;
        process.stdout.write(".");
      } catch (error) {
        results.errors.push(`Forever Bottle ${bottle.title}: ${error}`);
        process.stdout.write("x");
      }
    }
    console.log(` ✓ (${results.foreverBottles})\n`);

    // Create Essential Oils
    console.log("Creating Essential Oils...");
    for (const oil of ESSENTIAL_OILS) {
      try {
        await createEssentialOilProduct(oil);
        results.essentialOils++;
        process.stdout.write(".");
      } catch (error) {
        results.errors.push(`Essential Oil ${oil.name}: ${error}`);
        process.stdout.write("x");
      }
    }
    console.log(` ✓ (${results.essentialOils})\n`);

    // Create Accessories
    console.log("Creating Accessories...");
    for (const accessory of ACCESSORIES) {
      try {
        await createAccessory(accessory);
        results.accessories++;
        process.stdout.write(".");
      } catch (error) {
        results.errors.push(`Accessory ${accessory.name}: ${error}`);
        process.stdout.write("x");
      }
    }
    console.log(` ✓ (${results.accessories})\n`);

    // Create Refill Credit
    console.log("Creating Refill Credit product...");
    try {
      await createRefillCreditProduct();
      results.refillCredit = true;
      console.log("✓\n");
    } catch (error) {
      results.errors.push(`Refill Credit: ${error}`);
      console.log("x\n");
    }

    // Summary
    console.log("╔══════════════════════════════════════════════════════════════╗");
    console.log("║              Seeding Complete!                               ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");

    console.log("Summary:");
    console.log(`  ✓ Forever Bottles: ${results.foreverBottles}`);
    console.log(`  ✓ Essential Oils: ${results.essentialOils}`);
    console.log(`  ✓ Accessories: ${results.accessories}`);
    console.log(`  ✓ Refill Credit: ${results.refillCredit ? "Yes" : "No"}`);

    if (results.errors.length > 0) {
      console.log(`\n⚠️  ${results.errors.length} errors occurred:`);
      results.errors.forEach(e => console.log(`    - ${e}`));
    }

    console.log();

  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
