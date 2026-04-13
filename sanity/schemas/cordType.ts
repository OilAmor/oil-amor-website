import { defineField, defineType } from 'sanity'

export const cordTypeSchema = defineType({
  name: 'cordType',
  title: 'Cords, Charms & Chains',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Cord', value: 'cord' },
          { title: 'Charm', value: 'charm' },
          { title: 'Chain', value: 'chain' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      description: 'e.g., Cotton, Silk, Sterling Silver, Gold-plated',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tierRequirement',
      title: 'Tier Requirement',
      type: 'string',
      options: {
        list: [
          { title: 'Seed (Default)', value: 'seed' },
          { title: 'Sprout', value: 'sprout' },
          { title: 'Bloom', value: 'bloom' },
          { title: 'Radiance', value: 'radiance' },
          { title: 'Luminary', value: 'luminary' },
        ],
      },
      initialValue: 'seed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      description: '0 for standard cords included with purchase',
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Brief description for selection UI',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'e.g., Natural, Black, Gold, Silver',
    }),
    defineField({
      name: 'length',
      title: 'Length',
      type: 'string',
      description: 'e.g., 18", Adjustable, 16-20"',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Limited', value: 'limited' },
          { title: 'Unavailable', value: 'unavailable' },
        ],
      },
      initialValue: 'available',
    }),
    defineField({
      name: 'purchaseCountRequirement',
      title: 'Purchase Count Requirement',
      type: 'number',
      initialValue: 0,
      description: 'Minimum purchases required to unlock (for charms)',
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Selection',
      type: 'boolean',
      initialValue: false,
      description: 'Is this the default option for its type?',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 0,
      description: 'Display order within its type',
    }),
    defineField({
      name: 'symbolism',
      title: 'Symbolism',
      type: 'string',
      description: 'Metaphysical meaning (for charms)',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      type: 'type',
      tier: 'tierRequirement',
      media: 'images.0',
    },
    prepare({ title, type, tier, media }) {
      return {
        title,
        subtitle: `${type?.toUpperCase() || 'Item'} • Tier: ${tier || 'seed'}`,
        media,
      }
    },
  },
})
