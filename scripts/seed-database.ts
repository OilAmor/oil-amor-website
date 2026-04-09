#!/usr/bin/env tsx
// =============================================================================
// Database Seeding Script
// =============================================================================
// Seeds the database with initial data:
// - 12 Essential Oils
// - 12 Crystals
// - 144 Synergies (12 oils × 12 crystals)
// - Cord and charm catalog
// =============================================================================

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

// =============================================================================
// Configuration
// =============================================================================

const OILS_DATA = [
  {
    id: "lavender",
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    origin: "France",
    extractionMethod: "Steam distillation",
    description: "Calming and relaxing, promotes restful sleep and reduces stress.",
    benefits: ["Calming", "Sleep support", "Skin soothing", "Stress relief"],
    chakra: "Crown",
    element: "Air",
    safetyNotes: "Generally safe for all. Dilute before topical use.",
    blendsWellWith: ["Bergamot", "Frankincense", "Lemon", "Tea Tree"],
  },
  {
    id: "tea-tree",
    name: "Tea Tree",
    scientificName: "Melaleuca alternifolia",
    origin: "Australia",
    extractionMethod: "Steam distillation",
    description: "Powerful cleansing properties, supports immune system and skin health.",
    benefits: ["Cleansing", "Immune support", "Skin clarity", "Fresh air"],
    chakra: "Throat",
    element: "Water",
    safetyNotes: "Do not ingest. Keep away from pets.",
    blendsWellWith: ["Lavender", "Eucalyptus", "Lemon", "Peppermint"],
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    scientificName: "Eucalyptus globulus",
    origin: "Australia",
    extractionMethod: "Steam distillation",
    description: "Refreshing and invigorating, supports respiratory health.",
    benefits: ["Respiratory support", "Energizing", "Cleansing", "Mental clarity"],
    chakra: "Throat",
    element: "Air",
    safetyNotes: "Not for children under 6. Avoid during pregnancy.",
    blendsWellWith: ["Lavender", "Lemon", "Peppermint", "Rosemary"],
  },
  {
    id: "peppermint",
    name: "Peppermint",
    scientificName: "Mentha piperita",
    origin: "USA",
    extractionMethod: "Steam distillation",
    description: "Cooling and refreshing, aids digestion and mental focus.",
    benefits: ["Digestive support", "Mental focus", "Cooling", "Energy boost"],
    chakra: "Solar Plexus",
    element: "Fire",
    safetyNotes: "Dilute well. Avoid near eyes. Not for young children.",
    blendsWellWith: ["Lavender", "Lemon", "Eucalyptus", "Tea Tree"],
  },
  {
    id: "lemon",
    name: "Lemon",
    scientificName: "Citrus limon",
    origin: "Italy",
    extractionMethod: "Cold pressed",
    description: "Uplifting and cleansing, enhances mood and purifies air.",
    benefits: ["Uplifting", "Cleansing", "Focus", "Immune support"],
    chakra: "Solar Plexus",
    element: "Fire",
    safetyNotes: "Photosensitive - avoid sun for 12 hours after use.",
    blendsWellWith: ["Lavender", "Peppermint", "Tea Tree", "Frankincense"],
  },
  {
    id: "frankincense",
    name: "Frankincense",
    scientificName: "Boswellia carterii",
    origin: "Somalia",
    extractionMethod: "Steam distillation",
    description: "Sacred and grounding, supports meditation and skin rejuvenation.",
    benefits: ["Meditation", "Skin rejuvenation", "Grounding", "Spiritual connection"],
    chakra: "Crown",
    element: "Earth",
    safetyNotes: "Generally safe. Ideal for meditation blends.",
    blendsWellWith: ["Lavender", "Lemon", "Sandalwood", "Orange"],
  },
  {
    id: "bergamot",
    name: "Bergamot",
    scientificName: "Citrus bergamia",
    origin: "Italy",
    extractionMethod: "Cold pressed",
    description: "Uplifting and balancing, eases anxiety and promotes confidence.",
    benefits: ["Mood balancing", "Confidence", "Stress relief", "Skin support"],
    chakra: "Heart",
    element: "Air",
    safetyNotes: "FCF (furocoumarin-free) recommended for skin use.",
    blendsWellWith: ["Lavender", "Ylang Ylang", "Chamomile", "Sandalwood"],
  },
  {
    id: "ylang-ylang",
    name: "Ylang Ylang",
    scientificName: "Cananga odorata",
    origin: "Madagascar",
    extractionMethod: "Steam distillation",
    description: "Exotic and floral, promotes relaxation and romance.",
    benefits: ["Aphrodisiac", "Relaxation", "Hair health", "Mood support"],
    chakra: "Sacral",
    element: "Water",
    safetyNotes: "Use sparingly - strong scent. May cause headache in excess.",
    blendsWellWith: ["Bergamot", "Lavender", "Sandalwood", "Orange"],
  },
  {
    id: "chamomile",
    name: "Chamomile (Roman)",
    scientificName: "Anthemis nobilis",
    origin: "UK",
    extractionMethod: "Steam distillation",
    description: "Gentle and soothing, calms the mind and supports digestion.",
    benefits: ["Gentle calming", "Digestive ease", "Skin soothing", "Sleep support"],
    chakra: "Solar Plexus",
    element: "Water",
    safetyNotes: "Very gentle. Safe for children and sensitive skin.",
    blendsWellWith: ["Lavender", "Bergamot", "Rosemary", "Ylang Ylang"],
  },
  {
    id: "rosemary",
    name: "Rosemary",
    scientificName: "Rosmarinus officinalis",
    origin: "Spain",
    extractionMethod: "Steam distillation",
    description: "Stimulating and clarifying, enhances memory and focus.",
    benefits: ["Memory", "Focus", "Hair growth", "Respiratory support"],
    chakra: "Third Eye",
    element: "Fire",
    safetyNotes: "Avoid during pregnancy. Use ct. verbenone for children.",
    blendsWellWith: ["Lavender", "Lemon", "Peppermint", "Eucalyptus"],
  },
  {
    id: "sandalwood",
    name: "Sandalwood",
    scientificName: "Santalum album",
    origin: "India",
    extractionMethod: "Steam distillation",
    description: "Rich and woody, promotes deep meditation and skincare.",
    benefits: ["Meditation", "Skincare", "Grounding", "Confidence"],
    chakra: "Root",
    element: "Earth",
    safetyNotes: "Sustainably sourced. Precious - use mindfully.",
    blendsWellWith: ["Frankincense", "Lavender", "Ylang Ylang", "Bergamot"],
  },
  {
    id: "orange-sweet",
    name: "Orange (Sweet)",
    scientificName: "Citrus sinensis",
    origin: "Brazil",
    extractionMethod: "Cold pressed",
    description: "Joyful and uplifting, brings sunshine and positivity.",
    benefits: ["Joy", "Uplifting", "Immune support", "Digestion"],
    chakra: "Sacral",
    element: "Fire",
    safetyNotes: "Photosensitive. Store in cool place.",
    blendsWellWith: ["Lavender", "Peppermint", "Frankincense", "Ylang Ylang"],
  },
];

const CRYSTALS_DATA = [
  {
    id: "clear-quartz",
    name: "Clear Quartz",
    color: "Clear/White",
    chakra: "Crown",
    element: "All",
    properties: ["Clarity", "Amplification", "Healing", "Focus"],
    description: "The master healer that amplifies energy and thought.",
    pairings: ["Frankincense", "Lavender", "Rosemary", "Sandalwood"],
  },
  {
    id: "amethyst",
    name: "Amethyst",
    color: "Purple",
    chakra: "Third Eye",
    element: "Air",
    properties: ["Intuition", "Peace", "Spiritual growth", "Protection"],
    description: "Stone of spiritual wisdom and calming energy.",
    pairings: ["Frankincense", "Lavender", "Sandalwood", "Rosemary"],
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    color: "Pink",
    chakra: "Heart",
    element: "Water",
    properties: ["Love", "Compassion", "Healing", "Peace"],
    description: "Stone of unconditional love and heart healing.",
    pairings: ["Bergamot", "Ylang Ylang", "Lavender", "Chamomile"],
  },
  {
    id: "citrine",
    name: "Citrine",
    color: "Yellow/Gold",
    chakra: "Solar Plexus",
    element: "Fire",
    properties: ["Abundance", "Confidence", "Joy", "Manifestation"],
    description: "Stone of abundance and personal power.",
    pairings: ["Lemon", "Orange", "Peppermint", "Frankincense"],
  },
  {
    id: "carnelian",
    name: "Carnelian",
    color: "Orange/Red",
    chakra: "Sacral",
    element: "Fire",
    properties: ["Creativity", "Motivation", "Courage", "Vitality"],
    description: "Stone of motivation and endurance.",
    pairings: ["Orange", "Ylang Ylang", "Peppermint", "Lemon"],
  },
  {
    id: "black-tourmaline",
    name: "Black Tourmaline",
    color: "Black",
    chakra: "Root",
    element: "Earth",
    properties: ["Protection", "Grounding", "Purification", "Security"],
    description: "Powerful protection stone that grounds energy.",
    pairings: ["Sandalwood", "Frankincense", "Eucalyptus", "Tea Tree"],
  },
  {
    id: "sodalite",
    name: "Sodalite",
    color: "Blue/White",
    chakra: "Throat",
    element: "Water",
    properties: ["Communication", "Truth", "Intuition", "Logic"],
    description: "Stone of communication and truth.",
    pairings: ["Eucalyptus", "Tea Tree", "Peppermint", "Lavender"],
  },
  {
    id: "green-aventurine",
    name: "Green Aventurine",
    color: "Green",
    chakra: "Heart",
    element: "Earth",
    properties: ["Luck", "Prosperity", "Heart healing", "Growth"],
    description: "Stone of opportunity and heart-centered abundance.",
    pairings: ["Bergamot", "Chamomile", "Lavender", "Rosemary"],
  },
  {
    id: "tiger-eye",
    name: "Tiger's Eye",
    color: "Brown/Gold",
    chakra: "Solar Plexus",
    element: "Earth",
    properties: ["Confidence", "Protection", "Willpower", "Balance"],
    description: "Stone of courage and personal empowerment.",
    pairings: ["Frankincense", "Peppermint", "Lemon", "Orange"],
  },
  {
    id: "moonstone",
    name: "Moonstone",
    color: "White/Iridescent",
    chakra: "Crown",
    element: "Water",
    properties: ["Intuition", "Feminine energy", "New beginnings", "Calm"],
    description: "Stone of new beginnings and feminine energy.",
    pairings: ["Ylang Ylang", "Chamomile", "Lavender", "Sandalwood"],
  },
  {
    id: "red-jasper",
    name: "Red Jasper",
    color: "Red",
    chakra: "Root",
    element: "Earth",
    properties: ["Grounding", "Stability", "Strength", "Nurturing"],
    description: "Stone of endurance and grounding.",
    pairings: ["Sandalwood", "Frankincense", "Eucalyptus", "Peppermint"],
  },
  {
    id: "labradorite",
    name: "Labradorite",
    color: "Blue/Green/Iridescent",
    chakra: "Third Eye",
    element: "Water",
    properties: ["Magic", "Transformation", "Protection", "Intuition"],
    description: "Stone of transformation and magic.",
    pairings: ["Frankincense", "Lavender", "Rosemary", "Eucalyptus"],
  },
];

const CORDS_DATA = [
  { id: "natural-hemp", name: "Natural Hemp", color: "Natural Beige", price: 5 },
  { id: "black-wax", name: "Black Waxed Cotton", color: "Black", price: 6 },
  { id: "brown-leather", name: "Brown Leather", color: "Brown", price: 12 },
  { id: "gold-chain", name: "Gold-Plated Chain", color: "Gold", price: 18 },
  { id: "silver-chain", name: "Sterling Silver Chain", color: "Silver", price: 25 },
  { id: "macrame-cotton", name: "Macramé Cotton", color: "White", price: 8 },
];

const CHARMS_DATA = [
  { id: "lotus", name: "Lotus Flower", symbol: "Spiritual awakening", price: 8 },
  { id: "tree-of-life", name: "Tree of Life", symbol: "Growth and connection", price: 10 },
  { id: "moon", name: "Crescent Moon", symbol: "Intuition and cycles", price: 7 },
  { id: "sun", name: "Sun", symbol: "Vitality and energy", price: 7 },
  { id: "heart", name: "Heart", symbol: "Love and compassion", price: 6 },
  { id: "om", name: "Om Symbol", symbol: "Universal consciousness", price: 9 },
  { id: "hamsa", name: "Hamsa Hand", symbol: "Protection", price: 10 },
  { id: "feather", name: "Feather", symbol: "Freedom and lightness", price: 6 },
  { id: "star", name: "Star", symbol: "Guidance and hope", price: 5 },
  { id: "infinity", name: "Infinity", symbol: "Eternal connection", price: 8 },
];

// =============================================================================
// Database Connection
// =============================================================================

function getPool() {
  return new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "oil_amor",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  });
}

// =============================================================================
// Seed Functions
// =============================================================================

async function seedOils(pool: Pool): Promise<void> {
  console.log(`Seeding ${OILS_DATA.length} essential oils...`);
  
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    for (const oil of OILS_DATA) {
      await client.query(
        `INSERT INTO oils (
          id, name, scientific_name, origin, extraction_method,
          description, benefits, chakra, element, safety_notes, blends_well_with
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          scientific_name = EXCLUDED.scientific_name,
          origin = EXCLUDED.origin,
          extraction_method = EXCLUDED.extraction_method,
          description = EXCLUDED.description,
          benefits = EXCLUDED.benefits,
          chakra = EXCLUDED.chakra,
          element = EXCLUDED.element,
          safety_notes = EXCLUDED.safety_notes,
          blends_well_with = EXCLUDED.blends_well_with,
          updated_at = NOW()`,
        [
          oil.id,
          oil.name,
          oil.scientificName,
          oil.origin,
          oil.extractionMethod,
          oil.description,
          oil.benefits,
          oil.chakra,
          oil.element,
          oil.safetyNotes,
          oil.blendsWellWith,
        ]
      );
    }
    
    await client.query("COMMIT");
    console.log("✓ Oils seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function seedCrystals(pool: Pool): Promise<void> {
  console.log(`Seeding ${CRYSTALS_DATA.length} crystals...`);
  
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    for (const crystal of CRYSTALS_DATA) {
      await client.query(
        `INSERT INTO crystals (
          id, name, color, chakra, element, properties, description, pairings
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          color = EXCLUDED.color,
          chakra = EXCLUDED.chakra,
          element = EXCLUDED.element,
          properties = EXCLUDED.properties,
          description = EXCLUDED.description,
          pairings = EXCLUDED.pairings,
          updated_at = NOW()`,
        [
          crystal.id,
          crystal.name,
          crystal.color,
          crystal.chakra,
          crystal.element,
          crystal.properties,
          crystal.description,
          crystal.pairings,
        ]
      );
    }
    
    await client.query("COMMIT");
    console.log("✓ Crystals seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function seedSynergies(pool: Pool): Promise<void> {
  console.log("Generating synergy combinations...");
  
  const synergies = [];
  for (const oil of OILS_DATA) {
    for (const crystal of CRYSTALS_DATA) {
      const isRecommended = crystal.pairings.includes(oil.name);
      
      synergies.push({
        oilId: oil.id,
        crystalId: crystal.id,
        recommended: isRecommended,
        intensity: isRecommended ? "strong" : "moderate",
        notes: generateSynergyNotes(oil, crystal, isRecommended),
      });
    }
  }
  
  console.log(`Seeding ${synergies.length} synergies...`);
  
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    for (const synergy of synergies) {
      await client.query(
        `INSERT INTO synergies (
          oil_id, crystal_id, recommended, intensity, notes
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (oil_id, crystal_id) DO UPDATE SET
          recommended = EXCLUDED.recommended,
          intensity = EXCLUDED.intensity,
          notes = EXCLUDED.notes,
          updated_at = NOW()`,
        [
          synergy.oilId,
          synergy.crystalId,
          synergy.recommended,
          synergy.intensity,
          synergy.notes,
        ]
      );
    }
    
    await client.query("COMMIT");
    console.log("✓ Synergies seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function seedAccessories(pool: Pool): Promise<void> {
  console.log(`Seeding ${CORDS_DATA.length} cords and ${CHARMS_DATA.length} charms...`);
  
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Seed cords
    for (const cord of CORDS_DATA) {
      await client.query(
        `INSERT INTO cords (id, name, color, price)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           color = EXCLUDED.color,
           price = EXCLUDED.price,
           updated_at = NOW()`,
        [cord.id, cord.name, cord.color, cord.price]
      );
    }
    
    // Seed charms
    for (const charm of CHARMS_DATA) {
      await client.query(
        `INSERT INTO charms (id, name, symbol, price)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           symbol = EXCLUDED.symbol,
           price = EXCLUDED.price,
           updated_at = NOW()`,
        [charm.id, charm.name, charm.symbol, charm.price]
      );
    }
    
    await client.query("COMMIT");
    console.log("✓ Accessories seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function generateSynergyNotes(oil: typeof OILS_DATA[0], crystal: typeof CRYSTALS_DATA[0], recommended: boolean): string {
  const baseNotes: Record<string, string[]> = {
    "Clear Quartz": [`${oil.name} is amplified by Clear Quartz's master healing energy.`],
    "Amethyst": [`The calming energy of Amethyst deepens ${oil.name}'s spiritual qualities.`],
    "Rose Quartz": [`${oil.name} finds heart-centered expression with Rose Quartz.`],
    "Citrine": [`The bright energy of Citrine enhances ${oil.name}'s uplifting properties.`],
    "Carnelian": [`${oil.name} gains creative fire through Carnelian's vitality.`],
    "Black Tourmaline": [`${oil.name} is grounded and protected by Black Tourmaline.`],
    "Sodalite": [`${oil.name} expresses its truth through Sodalite's clarity.`],
    "Green Aventurine": [`${oil.name} blossoms with Green Aventurine's heart-luck.`],
    "Tiger's Eye": [`${oil.name} gains confidence and willpower from Tiger's Eye.`],
    "Moonstone": [`${oil.name} flows with Moonstone's intuitive wisdom.`],
    "Red Jasper": [`${oil.name} finds stability through Red Jasper's grounding.`],
    "Labradorite": [`${oil.name} transforms with Labradorite's magical energy.`],
  };
  
  const notes = baseNotes[crystal.name] || [`${oil.name} and ${crystal.name} create a unique energy combination.`];
  
  if (recommended) {
    notes.push("This is a highly recommended pairing.");
  }
  
  return notes.join(" ");
}

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<void> {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║            Oil Amor Database Seeding                         ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
  
  const pool = getPool();
  
  try {
    // Test connection
    await pool.query("SELECT 1");
    console.log("✓ Database connection established\n");
    
    // Seed in order
    await seedOils(pool);
    await seedCrystals(pool);
    await seedSynergies(pool);
    await seedAccessories(pool);
    
    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║              Seeding Complete! ✓                             ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");
    
    console.log("Summary:");
    console.log(`  • ${OILS_DATA.length} Essential Oils`);
    console.log(`  • ${CRYSTALS_DATA.length} Crystals`);
    console.log(`  • ${OILS_DATA.length * CRYSTALS_DATA.length} Synergies`);
    console.log(`  • ${CORDS_DATA.length} Cords`);
    console.log(`  • ${CHARMS_DATA.length} Charms`);
    console.log();
    
  } catch (error) {
    console.error("\n✗ Seeding failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
