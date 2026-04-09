import { defineField, defineType } from 'sanity'

export const oilSchema = defineType({
  name: 'oil',
  title: 'Essential Oils',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'botanicalName',
      title: 'Botanical Name',
      type: 'string',
      description: 'Scientific name (e.g., Lavandula angustifolia)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'commonName',
      title: 'Common Name',
      type: 'string',
      description: 'Common name (e.g., True Lavender)',
    }),
    defineField({
      name: 'origin',
      title: 'Origin',
      type: 'string',
      description: 'Country of origin (e.g., Bulgaria)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'story',
      title: 'Product Story',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Long-form storytelling about this oil',
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    // Enhanced crystal field - now references Crystal document
    defineField({
      name: 'crystal',
      title: 'Default Paired Crystal',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Crystal Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'property',
          title: 'Crystal Property',
          type: 'string',
          description: 'e.g., Tranquility, Grounding, Abundance',
        }),
        defineField({
          name: 'color',
          title: 'Color Description',
          type: 'string',
          description: 'e.g., Deep purple, Pale pink',
        }),
        defineField({
          name: 'reference',
          title: 'Crystal Reference',
          type: 'reference',
          to: [{ type: 'crystal' }],
          description: 'Link to full crystal document',
        }),
      ],
    }),
    // NEW: Crystal synergies array
    defineField({
      name: 'synergies',
      title: 'Crystal Synergies',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'synergy',
          fields: [
            defineField({
              name: 'crystal',
              title: 'Crystal',
              type: 'reference',
              to: [{ type: 'crystal' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Synergy Content Reference',
              type: 'reference',
              to: [{ type: 'synergyContent' }],
              description: 'Link to full synergy content document',
            }),
            defineField({
              name: 'strength',
              title: 'Synergy Strength',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Tertiary', value: 'tertiary' },
                ],
              },
            }),
          ],
        },
      ],
      description: 'All crystals that synergize with this oil',
    }),
    // NEW: Therapeutic properties
    defineField({
      name: 'therapeuticProperties',
      title: 'Therapeutic Properties',
      type: 'object',
      fields: [
        defineField({
          name: 'primary',
          title: 'Primary Benefits',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
            list: [
              { title: 'Calming', value: 'calming' },
              { title: 'Energizing', value: 'energizing' },
              { title: 'Balancing', value: 'balancing' },
              { title: 'Uplifting', value: 'uplifting' },
              { title: 'Grounding', value: 'grounding' },
              { title: 'Clarifying', value: 'clarifying' },
              { title: 'Soothing', value: 'soothing' },
              { title: 'Purifying', value: 'purifying' },
              { title: 'Warming', value: 'warming' },
              { title: 'Cooling', value: 'cooling' },
            ],
          },
        }),
        defineField({
          name: 'emotional',
          title: 'Emotional Benefits',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
        defineField({
          name: 'physical',
          title: 'Physical Benefits',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
        defineField({
          name: 'spiritual',
          title: 'Spiritual Benefits',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
      ],
    }),
    // NEW: Botanical origin details
    defineField({
      name: 'botanicalOrigin',
      title: 'Botanical Origin Details',
      type: 'object',
      fields: [
        defineField({
          name: 'plantPart',
          title: 'Plant Part Used',
          type: 'string',
          options: {
            list: [
              { title: 'Flowers', value: 'flowers' },
              { title: 'Leaves', value: 'leaves' },
              { title: 'Wood/Bark', value: 'wood' },
              { title: 'Resin', value: 'resin' },
              { title: 'Roots', value: 'roots' },
              { title: 'Peel', value: 'peel' },
              { title: 'Seeds', value: 'seeds' },
              { title: 'Needles', value: 'needles' },
            ],
          },
        }),
        defineField({
          name: 'harvestingInfo',
          title: 'Harvesting Information',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'sustainabilityNotes',
          title: 'Sustainability Notes',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    // NEW: Extraction method
    defineField({
      name: 'extractionMethod',
      title: 'Extraction Method',
      type: 'object',
      fields: [
        defineField({
          name: 'method',
          title: 'Method',
          type: 'string',
          options: {
            list: [
              { title: 'Steam Distillation', value: 'steam-distillation' },
              { title: 'Cold Press', value: 'cold-press' },
              { title: 'Solvent Extraction', value: 'solvent' },
              { title: 'CO2 Extraction', value: 'co2' },
              { title: 'Enfleurage', value: 'enfleurage' },
              { title: 'Hydrodistillation', value: 'hydrodistillation' },
            ],
          },
        }),
        defineField({
          name: 'details',
          title: 'Additional Details',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    // NEW: Safety notes
    defineField({
      name: 'safetyNotes',
      title: 'Safety Notes',
      type: 'object',
      fields: [
        defineField({
          name: 'dilutionRequired',
          title: 'Dilution Required',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'maxDilution',
          title: 'Maximum Dilution %',
          type: 'number',
          description: 'Maximum safe dilution percentage',
        }),
        defineField({
          name: 'contraindications',
          title: 'Contraindications',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
            list: [
              { title: 'Pregnancy', value: 'pregnancy' },
              { title: 'Breastfeeding', value: 'breastfeeding' },
              { title: 'Children', value: 'children' },
              { title: 'Sensitive Skin', value: 'sensitive-skin' },
              { title: 'Photosensitivity', value: 'photosensitivity' },
              { title: 'Epilepsy', value: 'epilepsy' },
              { title: 'High Blood Pressure', value: 'hypertension' },
            ],
          },
        }),
        defineField({
          name: 'additionalWarnings',
          title: 'Additional Warnings',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Floral', value: 'floral' },
          { title: 'Woody', value: 'woody' },
          { title: 'Citrus', value: 'citrus' },
          { title: 'Herbal', value: 'herbal' },
          { title: 'Resinous', value: 'resinous' },
          { title: 'Spicy', value: 'spicy' },
          { title: 'Minty', value: 'minty' },
          { title: 'Blend', value: 'blend' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'usage',
      title: 'Usage Instructions',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'e.g., Bestseller, Rare, New',
    }),
    defineField({
      name: 'shopifyProductId',
      title: 'Shopify Product ID',
      type: 'string',
      description: 'The Shopify product ID for sync',
    }),
    defineField({
      name: 'pairingSuggestions',
      title: 'Pairing Suggestions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'oil' }],
        },
      ],
      description: 'Other oils that pair well with this one',
    }),
    // NEW: Notes (olfactory profile)
    defineField({
      name: 'olfactoryProfile',
      title: 'Olfactory Profile',
      type: 'object',
      fields: [
        defineField({
          name: 'topNotes',
          title: 'Top Notes',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
        defineField({
          name: 'heartNotes',
          title: 'Heart Notes',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
        defineField({
          name: 'baseNotes',
          title: 'Base Notes',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'botanicalName',
      media: 'mainImage',
    },
  },
})
