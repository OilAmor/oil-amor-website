import { defineField, defineType } from 'sanity'

export const crystalSchema = defineType({
  name: 'crystal',
  title: 'Crystals',
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
      name: 'properties',
      title: 'Metaphysical Properties',
      type: 'object',
      fields: [
        defineField({
          name: 'chakra',
          title: 'Chakra',
          type: 'string',
          options: {
            list: [
              { title: 'Root (Muladhara)', value: 'root' },
              { title: 'Sacral (Svadhisthana)', value: 'sacral' },
              { title: 'Solar Plexus (Manipura)', value: 'solar-plexus' },
              { title: 'Heart (Anahata)', value: 'heart' },
              { title: 'Throat (Vishuddha)', value: 'throat' },
              { title: 'Third Eye (Ajna)', value: 'third-eye' },
              { title: 'Crown (Sahasrara)', value: 'crown' },
              { title: 'All Chakras', value: 'all' },
            ],
          },
        }),
        defineField({
          name: 'element',
          title: 'Element',
          type: 'string',
          options: {
            list: [
              { title: 'Earth', value: 'earth' },
              { title: 'Water', value: 'water' },
              { title: 'Fire', value: 'fire' },
              { title: 'Air', value: 'air' },
              { title: 'Ether/Spirit', value: 'ether' },
            ],
          },
        }),
        defineField({
          name: 'zodiac',
          title: 'Zodiac Signs',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Aries', value: 'aries' },
              { title: 'Taurus', value: 'taurus' },
              { title: 'Gemini', value: 'gemini' },
              { title: 'Cancer', value: 'cancer' },
              { title: 'Leo', value: 'leo' },
              { title: 'Virgo', value: 'virgo' },
              { title: 'Libra', value: 'libra' },
              { title: 'Scorpio', value: 'scorpio' },
              { title: 'Sagittarius', value: 'sagittarius' },
              { title: 'Capricorn', value: 'capricorn' },
              { title: 'Aquarius', value: 'aquarius' },
              { title: 'Pisces', value: 'pisces' },
            ],
          },
        }),
        defineField({
          name: 'origin',
          title: 'Origin',
          type: 'string',
          description: 'Primary source location (e.g., Brazil, Madagascar)',
        }),
        defineField({
          name: 'meaning',
          title: 'Core Meaning',
          type: 'string',
          description: 'Primary metaphysical meaning (e.g., Love, Protection, Clarity)',
        }),
      ],
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
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'in-stock' },
          { title: 'Low Stock', value: 'low-stock' },
          { title: 'Out of Stock', value: 'out-of-stock' },
          { title: 'Discontinued', value: 'discontinued' },
        ],
      },
      initialValue: 'in-stock',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'educationalContent',
      title: 'Educational Content',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contentBlock',
          fields: [
            defineField({
              name: 'title',
              title: 'Block Title',
              type: 'string',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
            }),
            defineField({
              name: 'type',
              title: 'Content Type',
              type: 'string',
              options: {
                list: [
                  { title: 'History', value: 'history' },
                  { title: 'Formation', value: 'formation' },
                  { title: 'Care', value: 'care' },
                  { title: 'Healing Properties', value: 'healing' },
                  { title: 'Meditation', value: 'meditation' },
                ],
              },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'hardness',
      title: 'Mohs Hardness',
      type: 'number',
      description: 'Mohs hardness scale (1-10)',
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: 'colorVariants',
      title: 'Color Variants',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Available color variations (e.g., Light Rose, Deep Pink)',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Crystal',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'properties.meaning',
      media: 'images.0',
    },
  },
})
