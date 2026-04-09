import { defineField, defineType } from 'sanity'

export const synergyContentSchema = defineType({
  name: 'synergyContent',
  title: 'Oil-Crystal Synergy Content',
  type: 'document',
  fields: [
    defineField({
      name: 'oil',
      title: 'Essential Oil',
      type: 'reference',
      to: [{ type: 'oil' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'crystal',
      title: 'Crystal',
      type: 'reference',
      to: [{ type: 'crystal' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Synergy Headline',
      type: 'string',
      description: 'Compelling headline for this combination (max 40 chars)',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'story',
      title: 'Synergy Story',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Emotional + educational narrative (150-200 words)',
    }),
    defineField({
      name: 'scientificNote',
      title: 'Scientific Note',
      type: 'text',
      rows: 2,
      description: 'Credible but accessible scientific explanation (1-2 sentences)',
    }),
    defineField({
      name: 'ritualInstructions',
      title: 'Ritual Instructions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'ritualStep',
          fields: [
            defineField({
              name: 'stepNumber',
              title: 'Step Number',
              type: 'number',
              validation: (Rule) => Rule.required().min(1).max(10),
            }),
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'instruction',
              title: 'Instruction',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'duration',
              title: 'Duration (optional)',
              type: 'string',
              description: 'e.g., "2 minutes", "Until candle burns out"',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'frequency',
      title: 'Frequency (Hz)',
      type: 'number',
      description: 'Optional: Solfeggio or other frequency associated with this synergy',
    }),
    defineField({
      name: 'frequencyName',
      title: 'Frequency Name',
      type: 'string',
      description: 'e.g., "528Hz - Love Frequency", "432Hz - Natural Tuning"',
    }),
    defineField({
      name: 'collectionTheme',
      title: 'Collection Theme',
      type: 'string',
      description: 'Thematic grouping (e.g., "Sleep Sanctuary", "Morning Ritual")',
    }),
    defineField({
      name: 'chakraAlignment',
      title: 'Chakra Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Root', value: 'root' },
          { title: 'Sacral', value: 'sacral' },
          { title: 'Solar Plexus', value: 'solar-plexus' },
          { title: 'Heart', value: 'heart' },
          { title: 'Throat', value: 'throat' },
          { title: 'Third Eye', value: 'third-eye' },
          { title: 'Crown', value: 'crown' },
          { title: 'Multiple', value: 'multiple' },
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
          { title: 'Ether', value: 'ether' },
          { title: 'Combined', value: 'combined' },
        ],
      },
    }),
    defineField({
      name: 'zodiacAffinity',
      title: 'Zodiac Affinity',
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
      name: 'bestTime',
      title: 'Best Time of Day',
      type: 'string',
      options: {
        list: [
          { title: 'Morning', value: 'morning' },
          { title: 'Midday', value: 'midday' },
          { title: 'Evening', value: 'evening' },
          { title: 'Night', value: 'night' },
          { title: 'Any Time', value: 'any' },
        ],
      },
    }),
    defineField({
      name: 'intention',
      title: 'Primary Intention',
      type: 'string',
      options: {
        list: [
          { title: 'Calm & Relaxation', value: 'calm' },
          { title: 'Energy & Vitality', value: 'energy' },
          { title: 'Love & Connection', value: 'love' },
          { title: 'Clarity & Focus', value: 'clarity' },
          { title: 'Protection & Grounding', value: 'protection' },
          { title: 'Abundance & Success', value: 'abundance' },
          { title: 'Healing & Recovery', value: 'healing' },
          { title: 'Spiritual Growth', value: 'spiritual' },
          { title: 'Creativity', value: 'creativity' },
          { title: 'Sleep & Dreams', value: 'sleep' },
        ],
      },
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'colorPalette',
      title: 'Color Palette',
      type: 'object',
      fields: [
        defineField({
          name: 'primary',
          title: 'Primary Color',
          type: 'string',
          description: 'Hex code (e.g., #7B68EE)',
        }),
        defineField({
          name: 'secondary',
          title: 'Secondary Color',
          type: 'string',
          description: 'Hex code',
        }),
        defineField({
          name: 'accent',
          title: 'Accent Color',
          type: 'string',
          description: 'Hex code',
        }),
      ],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Synergy',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      initialValue: 0,
      description: 'Higher numbers appear first',
    }),
  ],
  preview: {
    select: {
      oilTitle: 'oil.title',
      crystalName: 'crystal.name',
      headline: 'headline',
    },
    prepare({ oilTitle, crystalName, headline }) {
      return {
        title: headline || `${oilTitle} + ${crystalName}`,
        subtitle: `${oilTitle || 'Unknown Oil'} + ${crystalName || 'Unknown Crystal'}`,
      }
    },
  },
})
