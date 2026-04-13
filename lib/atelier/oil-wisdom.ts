/**
 * Oil Amor - Oil Wisdom Archive
 * Comprehensive multi-dimensional profiles for each oil
 * Scientific • Spiritual • Physical • Vibrational • Mental • Traditional
 */

// ============================================================================
// OIL CATEGORIES/FILTERS
// ============================================================================

export type OilCategory = 
  | 'antimicrobial'
  | 'anti-inflammatory'
  | 'respiratory'
  | 'skin-care'
  | 'stress-relief'
  | 'mood-uplifting'
  | 'hormone-balancing'
  | 'pain-relief'
  | 'digestive'
  | 'circulation'
  | 'mental-clarity'
  | 'spiritual-connection'
  | 'grounding'
  | 'aphrodisiac'
  | 'sleep-support'
  | 'immune-support'
  | 'memory-support'
  | 'citrus'

export const OIL_CATEGORIES: Record<OilCategory, {
  label: string
  description: string
  icon: string
}> = {
  antimicrobial: {
    label: 'Antimicrobial',
    description: 'Oils with powerful antibacterial, antiviral, and antifungal properties',
    icon: '🛡️',
  },
  'anti-inflammatory': {
    label: 'Anti-Inflammatory',
    description: 'Reduces inflammation, soothes irritated tissues, calms redness',
    icon: '🔥',
  },
  respiratory: {
    label: 'Respiratory Support',
    description: 'Opens airways, clears congestion, supports breathing',
    icon: '🫁',
  },
  'skin-care': {
    label: 'Skin Care',
    description: 'Nourishes, regenerates, tightens, or balances skin',
    icon: '✨',
  },
  'stress-relief': {
    label: 'Stress Relief',
    description: 'Calms the nervous system, reduces cortisol, promotes peace',
    icon: '🧘',
  },
  'mood-uplifting': {
    label: 'Mood Uplifting',
    description: 'Elevates mood, combats depression, brings joy',
    icon: '☀️',
  },
  'hormone-balancing': {
    label: 'Hormone Balancing',
    description: 'Supports endocrine system, regulates cycles, balances mood',
    icon: '🌙',
  },
  'pain-relief': {
    label: 'Pain Relief',
    description: 'Analgesic properties, reduces discomfort, eases tension',
    icon: '💆',
  },
  digestive: {
    label: 'Digestive Support',
    description: 'Aids digestion, reduces bloating, settles stomach',
    icon: '🌿',
  },
  circulation: {
    label: 'Circulation',
    description: 'Stimulates blood flow, warms, energizes',
    icon: '❤️',
  },
  'mental-clarity': {
    label: 'Mental Clarity',
    description: 'Enhances focus, improves memory, sharpens mind',
    icon: '🔮',
  },
  'spiritual-connection': {
    label: 'Spiritual Connection',
    description: 'Deepens meditation, opens intuition, connects to higher self',
    icon: '⭐',
  },
  grounding: {
    label: 'Grounding',
    description: 'Anchors energy, stabilizes emotions, connects to earth',
    icon: '🌳',
  },
  aphrodisiac: {
    label: 'Aphrodisiac',
    description: 'Awakens sensuality, enhances intimacy, boosts libido',
    icon: '💕',
  },
  'sleep-support': {
    label: 'Sleep Support',
    description: 'Promotes restful sleep, calms racing mind, induces dreams',
    icon: '🌙',
  },
  'immune-support': {
    label: 'Immune Support',
    description: 'Strengthens immune system, builds resilience',
    icon: '🛡️',
  },
  'memory-support': {
    label: 'Memory Support',
    description: 'Enhances memory, cognitive function, and mental recall',
    icon: '🧠',
  },
  'citrus': {
    label: 'Citrus',
    description: 'Bright, uplifting citrus oils with photosensitivity considerations',
    icon: '🍊',
  },
}

// SAFETY FIRST: External use only disclaimer
export const EXTERNAL_USE_ONLY = `
IMPORTANT SAFETY INFORMATION:
• All essential oils are for EXTERNAL USE ONLY
• Do NOT ingest essential oils unless under direct supervision of a qualified healthcare provider
• Always dilute properly before topical application (typically 1-3% for adults)
• Keep away from children and pets
• Avoid contact with eyes and mucous membranes
• If pregnant, nursing, or have medical conditions, consult a healthcare provider before use
`

// ============================================================================
// COMPREHENSIVE OIL WISDOM PROFILES
// ============================================================================

/**
 * IMPORTANT SAFETY NOTE:
 * All essential oils in this database are for EXTERNAL USE ONLY.
 * Do not ingest essential oils unless under direct supervision of 
 * a qualified aromatherapist or healthcare provider.
 * Always dilute properly before topical application.
 */

export interface OilWisdomProfile {
  id: string
  name: string
  latinName: string
  element: 'fire' | 'water' | 'earth' | 'air' | 'ether'
  chakra: string
  planets: string[]
  zodiac: string[]
  categories: OilCategory[]
  
  // Vibrational/Frequency
  frequency: {
    hz: number
    note: string
    description: string
  }
  
  // Multi-dimensional description
  description: {
    short: string
    scientific: string
    spiritual: string
    physical: string
    mental: string
    emotional: string
  }
  
  // Traditional & Historical
  traditionalUses: {
    cultures: string[]
    history: string
    folklore: string
    ceremonies: string[]
  }
  
  // Therapeutic Properties
  therapeutic: {
    benefits: string[]
    indications: string[]
    contraindications: string[]
    synergies: string[] // Which oils blend well
  }
  
  // Chemical Constituents
  constituents: {
    primary: string[]
    therapeuticAction: string
  }
  
  // Metaphysical
  metaphysical: {
    magicalUses: string[]
    affirmation: string
    tarotCorrespondence: string
    moonPhase: string
  }
  
  // Practical Application
  application: {
    bestMethods: string[]
    dilutionGuidelines: string
    blendingTips: string
  }
}

export type OilWisdomId = 
  | 'lavender'
  | 'tea-tree'
  | 'eucalyptus'
  | 'lemon'
  | 'myrrh'
  | 'lemongrass'
  | 'cinnamon-leaf'
  | 'clove-bud'
  | 'may-chang'
  | 'ginger'
  | 'carrot-seed'
  | 'lemon-myrtle'
  | 'cinnamon-bark'
  | 'geranium-bourbon'
  | 'juniper-berry'
  | 'patchouli-dark'
  | 'clary-sage'
  | 'bergamot-fcf'
  | 'sweet-orange'
  | 'frankincense'
  | 'peppermint'
  | 'grapefruit'
  | 'cedarwood'
  | 'ylang-ylang'
  | 'rosemary'
  | 'camphor-white'
  | 'vetiver'
  | 'ho-wood'
  | 'wintergreen'
  | 'cypress'
  | 'basil-linalool'
  | 'oregano'

export const OIL_WISDOM: { [key: string]: OilWisdomProfile | undefined } = {
  'lavender': {
    id: 'lavender',
    name: 'Lavender',
    latinName: 'Lavandula angustifolia',
    element: 'air',
    chakra: 'crown',
    planets: ['Mercury', 'Moon'],
    zodiac: ['Virgo', 'Gemini'],
    categories: ['stress-relief', 'sleep-support', 'skin-care', 'antimicrobial', 'mood-uplifting'],
    
    frequency: {
      hz: 118,
      note: 'D#',
      description: 'Calming frequency that promotes alpha brain waves and deep relaxation',
    },
    
    description: {
      short: 'The Mother of Aromatherapy - soothing, healing, and spiritually expansive',
      scientific: 'Linalool (30%) and linalyl acetate (32%) are the primary actives. Demonstrated anxiolytic effects through GABA receptor modulation similar to benzodiazepines but without sedation. Proven antimicrobial against Staphylococcus aureus, Pseudomonas aeruginosa, and Candida albicans. Accelerates wound healing through fibroblast stimulation and collagen synthesis.',
      spiritual: 'Lavender serves as a bridge between the physical and spiritual realms. It opens the crown chakra while grounding the root, creating a column of light through the body. Used since ancient Egypt for mummification and temple incense. It represents the divine feminine principle - nurturing, healing, and infinitely patient.',
      physical: 'Cytophylactic properties promote rapid skin cell regeneration, making it exceptional for burns, wounds, and scars. Regulates sebum production for all skin types. Powerful antispasmodic for muscular tension. Balances the autonomic nervous system.',
      mental: 'Quiets the analytical mind that cycles through worry. Brings clarity without stimulation, peace without dullness. The oil of "nowness" - bringing full presence to the present moment.',
      emotional: 'Soothes the inner child, heals emotional trauma stored in the body. Brings the feeling of being held and safe. For those who give too much to others and forget themselves.',
    },
    
    traditionalUses: {
      cultures: ['Ancient Egypt', 'Roman Empire', 'Medieval Europe', 'Traditional Chinese Medicine'],
      history: 'Distilled since the 16th century. Romans used it in baths (from Latin "lavare" - to wash). Queen Elizabeth I of England used it in teas and perfumes.',
      folklore: 'Placed in linen closets to ward off evil spirits and moths. Believed to restore lost virility when worn as a sachet.',
      ceremonies: ['Baptism purification', 'Midsummer rituals', 'Healing circles', 'Sleep ceremonies'],
    },
    
    therapeutic: {
      benefits: ['Calming', 'Antimicrobial', 'Skin regeneration', 'Pain relief', 'Sleep promotion'],
      indications: ['Anxiety', 'Insomnia', 'Burns', 'Acne', 'Muscle tension', 'Headaches', 'Menstrual cramps'],
      contraindications: ['First trimester pregnancy (use caution)', 'Pre-surgery (may enhance sedatives)'],
      synergies: ['Bergamot', 'Geranium', 'Rose', 'Sandalwood', 'Cedarwood'],
    },
    
    constituents: {
      primary: ['Linalyl acetate (32%)', 'Linalool (30%)', 'Cis-ocimene', 'Trans-ocimene'],
      therapeuticAction: 'Analgesic, anti-inflammatory, antimicrobial, nervine, vulnerary',
    },
    
    metaphysical: {
      magicalUses: ['Purification', 'Peace', 'Love', 'Protection', 'Clairvoyance'],
      affirmation: 'I am calm. I am centered. I am whole.',
      tarotCorrespondence: 'The Star - hope, healing, spiritual connection',
      moonPhase: 'Waxing Moon for growth and new beginnings',
    },
    
    application: {
      bestMethods: ['Diffusion', 'Topical (2-3%)', 'Bath', 'Inhalation', 'Pillow spray'],
      dilutionGuidelines: '2-3% for general use. 1% for facial application. Safe for most adults and children over 2.',
      blendingTips: 'The universal harmonizer - blends with virtually any oil. Use as a base and add small amounts of stronger oils.',
    },
  },

  'tea-tree': {
    id: 'tea-tree',
    name: 'Tea Tree',
    latinName: 'Melaleuca alternifolia',
    element: 'air',
    chakra: 'throat',
    planets: ['Mercury', 'Moon'],
    zodiac: ['Gemini', 'Virgo'],
    categories: ['antimicrobial', 'skin-care', 'immune-support', 'respiratory'],
    
    frequency: {
      hz: 142,
      note: 'C#',
      description: 'Purifying frequency that clears and protects',
    },
    
    description: {
      short: 'The Medicine Cabinet in a Bottle - nature\'s powerful protector',
      scientific: 'Terpinen-4-ol (40%) is the primary active constituent with demonstrated antimicrobial, antifungal, and antiviral properties. Clinical trials show efficacy against MRSA, Candida, and influenza. Stimulates white blood cell activity and enhances immune response.',
      spiritual: 'Tea Tree is the warrior-healer - fierce protection balanced with gentle care. It creates energetic boundaries while allowing the heart to remain open. Used by Aboriginal people for purification ceremonies.',
      physical: 'Exceptional for treating infections of all types - bacterial, fungal, viral. Powerful for acne, athlete\'s foot, and candida. Supports immune function. Decongestant for respiratory issues.',
      mental: 'Tea Tree brings mental clarity and focus. It cuts through confusion and indecision, helping you see the truth clearly.',
      emotional: 'For those who feel vulnerable, invaded, or need stronger boundaries. Tea Tree builds energetic shields while maintaining compassion.',
    },
    
    traditionalUses: {
      cultures: ['Australian Aboriginal', 'Modern Australian'],
      history: 'Bundjalung Aboriginal people of eastern Australia have used crushed tea tree leaves for thousands of years. Captain Cook named it "tea tree" in 1770.',
      folklore: 'Sacred to the Rainbow Serpent. Used in cleansing ceremonies after illness or death.',
      ceremonies: ['Healing rituals', 'Space cleansing', 'Protection ceremonies'],
    },
    
    therapeutic: {
      benefits: ['Antimicrobial', 'Antifungal', 'Immune stimulation', 'Skin healing', 'Respiratory support'],
      indications: ['Acne', 'Fungal infections', 'Cold/flu', 'Minor cuts', 'Insect bites', 'Dandruff'],
      contraindications: ['Sensitive skin (may irritate)', 'Never ingest (toxic)', 'Pets (toxic to cats)'],
      synergies: ['Lavender', 'Eucalyptus', 'Lemon', 'Clove', 'Rosemary'],
    },
    
    constituents: {
      primary: ['Terpinen-4-ol (40%)', 'Gamma-terpinene', 'Alpha-terpinene'],
      therapeuticAction: 'Antimicrobial, antifungal, antiviral, immunostimulant, expectorant',
    },
    
    metaphysical: {
      magicalUses: ['Protection', 'Purification', 'Healing', 'Boundaries'],
      affirmation: 'I am protected. I am strong. I am clear.',
      tarotCorrespondence: 'Knight of Swords - swift action, protection, clarity',
      moonPhase: 'Waning Moon for cleansing and protection',
    },
    
    application: {
      bestMethods: ['Spot treatment', 'Diffusion', 'Cleaning products', 'Foot soaks'],
      dilutionGuidelines: '0.5-2% for skin. Can be used neat on small areas for short periods.',
      blendingTips: 'Blend with lavender to soften medicinal scent. Use in cleaning sprays with lemon.',
    },
  },

  'eucalyptus': {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    latinName: 'Eucalyptus globulus',
    element: 'air',
    chakra: 'throat',
    planets: ['Mercury', 'Moon'],
    zodiac: ['Gemini', 'Virgo'],
    categories: ['respiratory', 'antimicrobial', 'mental-clarity', 'immune-support'],
    
    frequency: {
      hz: 155,
      note: 'D',
      description: 'Opening frequency that clears and expands',
    },
    
    description: {
      short: 'The Breath of Life - respiratory healer and mental clarifier',
      scientific: '1,8-cineole (eucalyptol) comprises 70-90% of the oil. Demonstrated bronchodilator effects, mucolytic action, and antimicrobial properties. Studies show cognitive enhancement and increased cerebral blood flow when inhaled.',
      spiritual: 'Eucalyptus clears stagnant energy like it clears the lungs. It represents the breath of life and the flow of prana. Aboriginal people used it for "smoking ceremonies" to cleanse the sick and welcome newborns.',
      physical: 'Primary respiratory oil - clears congestion, opens airways, fights respiratory infections. Decongestant, expectorant, and antimicrobial. Natural insect repellent. Cooling for fever.',
      mental: 'Eucalyptus brings mental clarity, alertness, and focus. It "clears the head" both literally and figuratively. Excellent for study and concentration.',
      emotional: 'For those feeling mentally foggy, stuck, or unable to "breathe" in life. Eucalyptus brings expansion, clarity, and renewed vitality.',
    },
    
    traditionalUses: {
      cultures: ['Australian Aboriginal', 'Traditional Chinese Medicine', 'European Colonial'],
      history: 'Used by Aboriginal people for millennia. First distilled in 1788. Used during the 1918 flu pandemic.',
      folklore: 'Considered a "fever tree" that could cool the body and ward off sickness.',
      ceremonies: ['Smoking ceremonies', 'Respiratory healing', 'Mental clarity rituals'],
    },
    
    therapeutic: {
      benefits: ['Respiratory support', 'Decongestant', 'Antimicrobial', 'Mental clarity', 'Fever reduction'],
      indications: ['Congestion', 'Bronchitis', 'Sinusitis', 'Mental fatigue', 'Cold/flu', 'Insect repellent'],
      contraindications: ['Children under 10 (can cause breathing issues)', 'High blood pressure', 'Epilepsy', 'Homeopathic remedies (antidotes)'],
      synergies: ['Tea Tree', 'Lemon', 'Peppermint', 'Lavender', 'Rosemary'],
    },
    
    constituents: {
      primary: ['1,8-Cineole (70-85%)', 'Alpha-pinene', 'Limonene'],
      therapeuticAction: 'Expectorant, mucolytic, antimicrobial, analgesic, stimulant',
    },
    
    metaphysical: {
      magicalUses: ['Cleansing', 'Healing', 'Mental clarity', 'Protection'],
      affirmation: 'I breathe freely. I think clearly. I move forward.',
      tarotCorrespondence: 'Ace of Swords - mental clarity, breakthrough, truth',
      moonPhase: 'New Moon for fresh starts and clarity',
    },
    
    application: {
      bestMethods: ['Steam inhalation', 'Diffusion', 'Chest rub', 'Shower drops'],
      dilutionGuidelines: '1-3% for chest rubs. Use caution on children.',
      blendingTips: 'Combine with peppermint for powerful respiratory blend. Add lemon for cleaning.',
    },
  },

  'lemon': {
    id: 'lemon',
    name: 'Lemon',
    latinName: 'Citrus limon',
    element: 'air',
    chakra: 'solar-plexus',
    planets: ['Sun', 'Moon'],
    zodiac: ['Leo', 'Gemini'],
    categories: ['mood-uplifting', 'antimicrobial', 'mental-clarity', 'immune-support'],
    
    frequency: {
      hz: 141,
      note: 'C#',
      description: 'Bright, uplifting frequency that energizes and purifies',
    },
    
    description: {
      short: 'Liquid Sunshine - joy, clarity, and cleansing',
      scientific: 'Limonene comprises 65-75% of lemon oil, giving it powerful antioxidant and mood-elevating properties. Studies show significant reduction in anxiety and depression symptoms when inhaled. Demonstrated antimicrobial against Salmonella, E. coli, and Staphylococcus.',
      spiritual: 'Lemon carries the energy of the sun - bright, cleansing, and life-giving. It cuts through energetic blockages like a ray of light through clouds. Associated with the solar plexus, it boosts confidence and personal power.',
      physical: 'Powerful detoxifier - stimulates lymphatic drainage and liver function. Antimicrobial and antiseptic. Uplifting for fatigue and depression. Skin brightening (phototoxic - use sun protection).',
      mental: 'Lemon brings mental clarity, focus, and optimism. It dispels confusion and brings "sunny" thinking. Excellent for decision-making and mental fatigue.',
      emotional: 'For depression, apathy, and emotional heaviness. Lemon brings lightness, joy, and hope. It helps release old patterns and embrace new possibilities.',
    },
    
    traditionalUses: {
      cultures: ['Ancient India', 'Ancient Middle East', 'Mediterranean', 'European'],
      history: 'Originated in India/China, spread through Middle East by 100 AD. Used by sailors to prevent scurvy.',
      folklore: 'Believed to ward off the evil eye. Used in purification baths before magical work.',
      ceremonies: ['Cleansing rituals', 'New beginnings', 'Joy ceremonies', 'Purification baths'],
    },
    
    therapeutic: {
      benefits: ['Mood elevation', 'Antimicrobial', 'Detoxification', 'Mental clarity', 'Immune support'],
      indications: ['Depression', 'Fatigue', 'Poor concentration', 'Infections', 'Lymphatic congestion'],
      contraindications: ['Photosensitivity (avoid sun 12 hours after use)', 'Sensitive skin'],
      synergies: ['Lavender', 'Eucalyptus', 'Tea Tree', 'Peppermint', 'Geranium'],
    },
    
    constituents: {
      primary: ['Limonene (65-75%)', 'Beta-pinene', 'Gamma-terpinene'],
      therapeuticAction: 'Antimicrobial, antioxidant, lymphatic stimulant, mood elevator',
    },
    
    metaphysical: {
      magicalUses: ['Cleansing', 'Purification', 'Joy', 'Mental clarity', 'New beginnings'],
      affirmation: 'I am light. I am joy. I move forward with clarity.',
      tarotCorrespondence: 'The Sun - joy, success, vitality',
      moonPhase: 'Waxing Moon for growth and new projects',
    },
    
    application: {
      bestMethods: ['Diffusion', 'Cleaning products', 'Bath', 'Inhalation'],
      dilutionGuidelines: '1-2% for skin. Photosensitizing - avoid sun exposure after use.',
      blendingTips: 'Use in cleaning blends with tea tree. Combine with lavender for calming citrus blend.',
    },
  },

  'myrrh': {
    id: 'myrrh',
    name: 'Myrrh',
    latinName: 'Commiphora myrrha',
    element: 'earth',
    chakra: 'root',
    planets: ['Saturn', 'Mars'],
    zodiac: ['Capricorn', 'Scorpio'],
    categories: ['skin-care', 'spiritual-connection', 'grounding', 'anti-inflammatory', 'immune-support'],
    
    frequency: {
      hz: 98,
      note: 'G#',
      description: 'Ancient frequency of the Earth, grounding and centering',
    },
    
    description: {
      short: 'The Ancient Healer - sacred medicine of transformation',
      scientific: 'Myrrh contains furanodiene, curzerene, and lindestrene with potent anti-inflammatory and antimicrobial properties. It has been shown to stimulate macrophage activity and support immune response. Myrrh promotes wound healing through stimulation of fibroblasts and collagen synthesis.',
      spiritual: 'Myrrh is the oil of the Mysteries - it guides souls through transformation and rebirth. Used in embalming, it represents the death that must occur for new life to emerge. It grounds spiritual energy into the physical body, making it excellent for manifestation work. It represents the Divine Feminine and the mysteries of the dark moon.',
      physical: 'Exceptional for wound healing and skin regeneration. Powerful antifungal. Supports oral health (historically used in tooth powders). Emmenagogue - supports menstrual flow. Grounds scattered energy in the physical body.',
      mental: 'Myrrh brings wisdom born of experience. It helps process grief and loss, transforming pain into understanding. It slows down racing thoughts and brings presence.',
      emotional: 'For deep grief, loss, and major life transitions. Myrrh holds space for the darkness and emerges with wisdom. It helps release what no longer serves and embrace transformation.',
    },
    
    traditionalUses: {
      cultures: ['Ancient Egypt', 'Biblical Israel', 'Traditional Chinese Medicine', 'Ayurveda'],
      history: 'Myrrh was one of the three gifts given to Jesus, valued equally with gold. Egyptian queens used it in skincare. Chinese medicine has used it for circulatory conditions for millennia.',
      folklore: 'Legend says myrrh trees wept tears of resin when the goddess Myrrha was transformed into a tree. It was believed to protect the soul in the afterlife.',
      ceremonies: ['Funeral rites', 'Grief ceremonies', 'Rites of passage', 'Shadow work'],
    },
    
    therapeutic: {
      benefits: ['Wound healing', 'Skin regeneration', 'Immune support', 'Oral health', 'Emotional grounding'],
      indications: ['Wounds', 'Fungal infections', 'Gum disease', 'Grief', 'Menstrual issues', 'Skin aging'],
      contraindications: ['Pregnancy (emmenagogue)', 'Fever (warming oil)'],
      synergies: ['Frankincense', 'Sandalwood', 'Lavender', 'Patchouli', 'Cedarwood'],
    },
    
    constituents: {
      primary: ['Furanodiene', 'Curzerene', 'Lindestrene', 'Beta-elemene'],
      therapeuticAction: 'Anti-inflammatory, antimicrobial, vulnerary, emmenagogue, grounding',
    },
    
    metaphysical: {
      magicalUses: ['Transformation', 'Grief work', 'Protection', 'Manifestation', 'Ancestral connection'],
      affirmation: 'I embrace transformation. Wisdom flows through me.',
      tarotCorrespondence: 'Death - transformation, endings, rebirth',
      moonPhase: 'Dark Moon for deep inner work and transformation',
    },
    
    application: {
      bestMethods: ['Wound care', 'Skincare', 'Meditation', 'Diffusion'],
      dilutionGuidelines: '1-3% for skin. Very thick - warm bottle in hands before use.',
      blendingTips: 'Pairs beautifully with Frankincense for spiritual work. Add to skin blends for regeneration.',
    },
  },

  'lemongrass': {
    id: 'lemongrass',
    name: 'Lemongrass',
    latinName: 'Cymbopogon flexuosus',
    element: 'air',
    chakra: 'solar-plexus',
    planets: ['Mercury', 'Sun'],
    zodiac: ['Gemini', 'Leo'],
    categories: ['antimicrobial', 'mood-uplifting', 'digestive', 'mental-clarity'],
    frequency: { hz: 150, note: 'D', description: 'Energizing frequency that clears stagnation' },
    description: {
      short: 'The Cleansing Fire - purifies mind, body, and space',
      scientific: 'Lemongrass contains high levels of citral (up to 85%), which demonstrates potent antimicrobial and anti-inflammatory properties. Studies show it effectively inhibits the growth of bacteria and fungi. The oil has been shown to reduce cholesterol levels and support healthy digestion when used aromatically.',
      spiritual: 'Lemongrass is the spiritual housekeeper. It clears stagnant energy from spaces and auras, cutting through confusion and mental fog. It represents the fresh breeze that disperses dark clouds, bringing clarity and renewed perspective.',
      physical: 'Powerful antimicrobial for cleaning and topical use. Supports healthy digestion and reduces bloating. Acts as a natural deodorant. Helps reduce muscle pain and inflammation when used in massage.',
      mental: 'Lemongrass cuts through mental confusion and procrastination. It brings focus, clarity, and the motivation to take action. Excellent for when you feel mentally stuck or overwhelmed.',
      emotional: 'For those feeling burdened by life\'s complexities. Lemongrass simplifies, clarifies, and brings a sense of lightness and possibility.',
    },
    traditionalUses: {
      cultures: ['Traditional Indian Medicine', 'Southeast Asia', 'Caribbean'],
      history: 'Used in Indian Ayurvedic medicine for thousands of years to treat infectious diseases and reduce fever. Traditional Thai massage incorporates lemongrass for its warming and pain-relieving properties.',
      folklore: 'In Caribbean folk magic, lemongrass is used to "open the road" - removing obstacles and bringing opportunities.',
      ceremonies: ['Space cleansing', 'New beginnings', 'Success rituals'],
    },
    therapeutic: {
      benefits: ['Antimicrobial', 'Digestive support', 'Pain relief', 'Mental clarity', 'Natural deodorant'],
      indications: ['Digestive issues', 'Muscle pain', 'Fatigue', 'Mental fog', 'Athlete\'s foot'],
      contraindications: ['Pregnancy (first trimester)', 'Sensitive skin (may irritate)', 'Glaucoma'],
      synergies: ['Lemon', 'Lavender', 'Tea Tree', 'Eucalyptus', 'Peppermint'],
    },
    constituents: { primary: ['Citral (75-85%)', 'Geraniol', 'Limonene'], therapeuticAction: 'Antimicrobial, digestive stimulant, analgesic, nervine' },
    metaphysical: { magicalUses: ['Obstacle removal', 'Mental clarity', 'Cleansing', 'Success'], affirmation: 'I am clear. I move forward with confidence.', tarotCorrespondence: 'Eight of Wands - swift movement, progress', moonPhase: 'Waxing Moon for new opportunities' },
    application: { bestMethods: ['Diffusion', 'Cleaning spray', 'Massage', 'Bath'], dilutionGuidelines: '0.5-2% for skin - can irritate sensitive skin', blendingTips: 'Combine with citrus oils for uplifting blends, with lavender for calming digestion support.' },
  },

  'cinnamon-leaf': {
    id: 'cinnamon-leaf',
    name: 'Cinnamon Leaf',
    latinName: 'Cinnamomum verum',
    element: 'fire',
    chakra: 'solar-plexus',
    planets: ['Sun', 'Mars'],
    zodiac: ['Aries', 'Leo'],
    categories: ['antimicrobial', 'circulation', 'mood-uplifting', 'immune-support'],
    frequency: { hz: 256, note: 'C', description: 'Warming frequency that stimulates and energizes' },
    description: {
      short: 'The Warm Embrace - comforting, stimulating, protective',
      scientific: 'Cinnamon leaf oil contains high levels of eugenol (up to 85%), which provides potent antimicrobial, analgesic, and anti-inflammatory properties. The oil has been shown to improve circulation and support immune function. Unlike cinnamon bark oil, leaf oil is gentler on skin but still powerful therapeutically.',
      spiritual: 'Cinnamon leaf carries the warmth of the hearth fire. It creates feelings of safety, comfort, and protection. It stimulates the solar plexus, boosting confidence and personal power. Used since ancient times in temple incense.',
      physical: 'Excellent circulatory stimulant - warms cold hands and feet. Strong antimicrobial properties support immune system. Can help reduce muscle and joint pain. Natural insect repellent.',
      mental: 'Cinnamon leaf dispels mental fatigue and brings warmth to cold, analytical thinking. It stimulates creativity and courage, helping you take bold action.',
      emotional: 'For those feeling emotionally cold, isolated, or lacking courage. Cinnamon leaf brings warmth, connection, and the bravery to be seen.',
    },
    traditionalUses: {
      cultures: ['Ancient Egypt', 'Traditional Chinese Medicine', 'Ayurveda', 'Medieval Europe'],
      history: 'Cinnamon was more valuable than gold in ancient times. Egyptians used it in embalming. It has been used in traditional Chinese medicine for thousands of years to warm the body and improve circulation.',
      folklore: 'In medieval Europe, cinnamon was believed to increase psychic powers and protect against evil. It was a key ingredient in love potions.',
      ceremonies: ['Protection rituals', 'Prosperity work', 'Winter solstice', 'Hearth blessings'],
    },
    therapeutic: {
      benefits: ['Circulation', 'Antimicrobial', 'Pain relief', 'Immune support', 'Warming'],
      indications: ['Poor circulation', 'Cold hands/feet', 'Muscle pain', 'Low immunity', 'Mental fatigue'],
      contraindications: ['Pregnancy', 'Sensitive skin', 'Blood clotting disorders', 'Children under 6'],
      synergies: ['Clove', 'Orange', 'Lemon', 'Eucalyptus', 'Rosemary'],
    },
    constituents: { primary: ['Eugenol (70-85%)', 'Cinnamaldehyde', 'Linalool'], therapeuticAction: 'Antimicrobial, circulatory stimulant, analgesic, immune support' },
    metaphysical: { magicalUses: ['Protection', 'Prosperity', 'Love', 'Psychic enhancement'], affirmation: 'I am warm, protected, and powerful.', tarotCorrespondence: 'Strength - courage, warmth, inner power', moonPhase: 'Full Moon for maximum power' },
    application: { bestMethods: ['Diffusion', 'Massage (low dilution)', 'Compress', 'Inhalation'], dilutionGuidelines: 'Maximum 0.5% for skin - very strong. Patch test first.', blendingTips: 'Blend with sweet orange to soften spice. Add to carrier oils for warming massage.' },
  },

  'clove-bud': {
    id: 'clove-bud',
    name: 'Clove Bud',
    latinName: 'Syzygium aromaticum',
    element: 'fire',
    chakra: 'root',
    planets: ['Mars', 'Jupiter'],
    zodiac: ['Aries', 'Scorpio'],
    categories: ['antimicrobial', 'pain-relief', 'immune-support', 'circulation'],
    frequency: { hz: 285, note: 'D', description: 'Powerful frequency that numbs pain and kills pathogens' },
    description: {
      short: 'The Mighty Protector - nature\'s most potent antimicrobial',
      scientific: 'Clove bud oil contains 80-90% eugenol, the highest concentration of any essential oil. Eugenol is a powerful anesthetic and antimicrobial agent. The oil has an ORAC (antioxidant) score of over 1 million - the highest of any plant oil. It has been proven effective against Candida, Staphylococcus, and even some viruses.',
      spiritual: 'Clove is the warrior\'s oil - fierce protection, potent boundaries, and the courage to face any challenge. It grounds deeply into the root chakra, providing stability and strength. Used in exorcism and protection rituals across many cultures.',
      physical: 'Nature\'s most powerful topical anesthetic - numbs dental pain effectively. Potent antimicrobial for infections. Strong antioxidant. Warms and improves circulation. Natural insect repellent.',
      mental: 'Clove cuts through indecision and weakness. It brings mental clarity, focus, and the determination to overcome obstacles. Helps with memory and cognitive function.',
      emotional: 'For those feeling victimized, powerless, or overwhelmed. Clove restores personal power, boundaries, and the courage to stand up for oneself.',
    },
    traditionalUses: {
      cultures: ['Traditional Chinese Medicine', 'Ayurveda', 'Medieval Europe', 'Indonesia'],
      history: 'Used in Chinese medicine for over 2,000 years. The Dutch waged wars to control the clove trade in the Spice Islands. Used in dentistry since the 19th century for pain relief.',
      folklore: 'In Indonesian folklore, clove trees were born from the love of two separated lovers. Clove buds were placed in pomanders to ward off the plague in medieval Europe.',
      ceremonies: ['Protection rituals', 'Exorcism', 'Strength spells', 'Healing work'],
    },
    therapeutic: {
      benefits: ['Pain relief', 'Antimicrobial', 'Antioxidant', 'Circulation', 'Immune support'],
      indications: ['Toothache', 'Infections', 'Cold/flu', 'Muscle pain', 'Warts', 'Low immunity'],
      contraindications: ['Pregnancy', 'Blood thinners', 'Children under 12', 'Sensitive skin', 'High blood pressure'],
      synergies: ['Cinnamon', 'Orange', 'Tea Tree', 'Lavender', 'Frankincense'],
    },
    constituents: { primary: ['Eugenol (85-90%)', 'Eugenyl acetate', 'Caryophyllene'], therapeuticAction: 'Anesthetic, antimicrobial, antioxidant, circulatory stimulant' },
    metaphysical: { magicalUses: ['Protection', 'Banishing', 'Courage', 'Healing', 'Memory'], affirmation: 'I am powerful. I am protected.', tarotCorrespondence: 'Tower - breaking through, transformation through fire', moonPhase: 'Dark Moon for banishing and protection' },
    application: { bestMethods: ['Diffusion', 'Diluted topical (very low)', 'Clove bud on tooth', 'Inhalation'], dilutionGuidelines: 'Maximum 0.5% for skin - extremely strong. Use with extreme caution.', blendingTips: 'Use sparingly - a little goes a long way. Blend with citrus to soften. Never use undiluted on skin.' },
  },

  'may-chang': {
    id: 'may-chang',
    name: 'May Chang',
    latinName: 'Litsea cubeba',
    element: 'air',
    chakra: 'solar-plexus',
    planets: ['Mercury', 'Sun'],
    zodiac: ['Gemini', 'Virgo'],
    categories: ['mood-uplifting', 'antimicrobial', 'skin-care', 'mental-clarity'],
    frequency: { hz: 144, note: 'D', description: 'Bright frequency that uplifts and clarifies' },
    description: {
      short: 'Mountain Lemon - joyful clarity and gentle power',
      scientific: 'May Chang contains up to 85% citral (geranial and neral), giving it powerful antimicrobial and mood-elevating properties. It is gentler on skin than lemon while providing similar benefits. Studies show it helps reduce inflammation and supports healthy digestion.',
      spiritual: 'May Chang is the oil of mountain wisdom - clarity gained from rising above life\'s chaos. It brings joy without mania, upliftment grounded in truth. It clears the solar plexus of doubts and fears, bringing authentic confidence.',
      physical: 'Excellent for oily skin and acne - regulates sebum production. Supports healthy digestion. Antimicrobial for cleaning. Uplifting for fatigue and depression.',
      mental: 'May Chang brings mental sunshine without overstimulation. It clears confusion, improves focus, and brings a sense of "everything is manageable."',
      emotional: 'For those feeling overwhelmed, anxious, or burdened by responsibility. May Chang brings lightness, laughter, and perspective.',
    },
    traditionalUses: {
      cultures: ['Traditional Chinese Medicine', 'Taiwan', 'Indonesia'],
      history: 'Used in Traditional Chinese Medicine for digestive issues and to clear heat from the body. The berries have been used in Asian cuisine for centuries.',
      folklore: 'Called "mountain pepper" in Taiwan, it was believed to ward off evil spirits when hung in doorways.',
      ceremonies: ['Cleansing rituals', 'Mental clarity work', 'Joy ceremonies'],
    },
    therapeutic: {
      benefits: ['Mood elevation', 'Skin balancing', 'Digestive support', 'Antimicrobial', 'Mental clarity'],
      indications: ['Acne', 'Oily skin', 'Indigestion', 'Stress', 'Mental fog'],
      contraindications: ['Pregnancy (first trimester)', 'Sensitive skin (may irritate)'],
      synergies: ['Lavender', 'Geranium', 'Bergamot', 'Rosemary', 'Cedarwood'],
    },
    constituents: { primary: ['Citral (65-85%)', 'Limonene', 'Methyl heptenone'], therapeuticAction: 'Antimicrobial, mood elevator, digestive aid, astringent' },
    metaphysical: { magicalUses: ['Joy', 'Clarity', 'Cleansing', 'Confidence'], affirmation: 'I rise above with clarity and joy.', tarotCorrespondence: 'Sun - joy, clarity, success', moonPhase: 'Waxing Moon for growth and clarity' },
    application: { bestMethods: ['Diffusion', 'Skincare', 'Bath', 'Cleaning'], dilutionGuidelines: '0.5-2% for skin - gentler than lemon', blendingTips: 'Use as a gentler alternative to lemon. Blends beautifully with florals and woods.' },
  },

  'ginger': {
    id: 'ginger',
    name: 'Ginger',
    latinName: 'Zingiber officinale',
    element: 'fire',
    chakra: 'solar-plexus',
    planets: ['Mars', 'Sun'],
    zodiac: ['Aries', 'Leo'],
    categories: ['digestive', 'circulation', 'pain-relief', 'anti-inflammatory'],
    frequency: { hz: 198, note: 'G', description: 'Warming frequency that stimulates and grounds' },
    description: {
      short: 'The Fiery Root - digestive fire and warming comfort',
      scientific: 'Ginger oil contains zingiberene, beta-sesquiphellandrene, and gingerols. These compounds provide potent anti-inflammatory and analgesic effects. Studies show it reduces nausea, improves digestion, and reduces muscle pain. The warming effect increases blood flow to tissues.',
      spiritual: 'Ginger is the oil of digestive fire - not just physical, but the fire of transformation, will, and personal power. It activates the solar plexus, boosting confidence and the ability to "digest" life\'s experiences. It grounds while stimulating, providing stable energy.',
      physical: 'Exceptional for digestive issues - nausea, bloating, indigestion. Powerful anti-inflammatory for muscle and joint pain. Warms cold conditions. Improves circulation. Helps with motion sickness.',
      mental: 'Ginger clears mental fog and apathy. It brings motivation, courage, and the "fire" to take action. Helps with decision-making and assertiveness.',
      emotional: 'For those feeling emotionally "frozen," apathetic, or lacking motivation. Ginger restores passion, enthusiasm, and the will to engage with life.',
    },
    traditionalUses: {
      cultures: ['Ayurveda', 'Traditional Chinese Medicine', 'Ancient Rome', 'Arabic Medicine'],
      history: 'Used for over 4,000 years in Ayurvedic medicine. Traded extensively along the Spice Route. Romans valued it highly for digestive complaints.',
      folklore: 'In Ayurveda, ginger is called "vishwabhesaja" - the universal medicine. It was believed to ward off evil spirits and attract prosperity.',
      ceremonies: ['Digestive blessings', 'Prosperity rituals', 'Warming ceremonies', 'Courage spells'],
    },
    therapeutic: {
      benefits: ['Digestive support', 'Anti-nausea', 'Pain relief', 'Circulation', 'Anti-inflammatory'],
      indications: ['Nausea', 'Motion sickness', 'Indigestion', 'Muscle pain', 'Arthritis', 'Poor circulation'],
      contraindications: ['Gallstones', 'High doses during pregnancy', 'Blood thinners (use caution)'],
      synergies: ['Lemon', 'Lavender', 'Peppermint', 'Eucalyptus', 'Orange'],
    },
    constituents: { primary: ['Zingiberene (30%)', 'Beta-sesquiphellandrene', 'Gingerols'], therapeuticAction: 'Digestive stimulant, antiemetic, analgesic, circulatory stimulant' },
    metaphysical: { magicalUses: ['Prosperity', 'Courage', 'Digestive fire', 'Warming', 'Motivation'], affirmation: 'I digest life with ease. I am powerful.', tarotCorrespondence: 'Wands suit - fire, action, will', moonPhase: 'First Quarter for taking action' },
    application: { bestMethods: ['Diffusion', 'Abdominal massage', 'Inhalation', 'Bath'], dilutionGuidelines: '1-3% for skin. Very warming - patch test first.', blendingTips: 'Combine with citrus for nausea relief. Blend with lavender for calming digestive support.' },
  },

  'carrot-seed': {
    id: 'carrot-seed',
    name: 'Carrot Seed',
    latinName: 'Daucus carota',
    element: 'earth',
    chakra: 'sacral',
    planets: ['Moon', 'Saturn'],
    zodiac: ['Cancer', 'Capricorn'],
    categories: ['skin-care', 'anti-inflammatory', 'mood-uplifting', 'hormone-balancing'],
    frequency: { hz: 165, note: 'E', description: 'Grounding frequency that nourishes and regenerates' },
    description: {
      short: 'The Skin Rejuvenator - cellular regeneration and earthy wisdom',
      scientific: 'Carrot seed oil contains carotol, daucol, and beta-caryophyllene. It has exceptional regenerative properties for skin cells. Studies show it helps reduce fine lines, improves skin elasticity, and promotes wound healing. It also supports liver function and hormone balance.',
      spiritual: 'Carrot seed is the oil of earthy wisdom and gentle renewal. It teaches patience, grounding, and the beauty of slow, steady growth. It connects to ancestral wisdom and the nurturing energy of Mother Earth.',
      physical: 'Exceptional for mature skin - reduces wrinkles, age spots, and improves elasticity. Supports liver health and hormone balance. Helps with PMS symptoms. Promotes wound healing and reduces scarring.',
      mental: 'Carrot seed brings mental grounding and patience. It helps with long-term planning and seeing projects through to completion. Reduces scattered thinking.',
      emotional: 'For those feeling disconnected from their bodies, impatient, or struggling with self-acceptance. Carrot seed brings grounding, self-love, and appreciation for natural beauty.',
    },
    traditionalUses: {
      cultures: ['Traditional European Medicine', 'Ayurveda', 'Ancient Greece'],
      history: 'Used since ancient times for digestive and skin conditions. The Greeks used carrot seed oil for stomach complaints. Traditional European herbalists prized it for liver support.',
      folklore: 'The wild carrot was called "Queen Anne\'s Lace." It was believed to increase fertility and was used in love spells.',
      ceremonies: ['Fertility rituals', 'Skin blessings', 'Grounding ceremonies', 'Ancestral work'],
    },
    therapeutic: {
      benefits: ['Skin regeneration', 'Anti-aging', 'Hormone balance', 'Liver support', 'Wound healing'],
      indications: ['Mature skin', 'Wrinkles', 'Age spots', 'PMS', 'Hormonal acne', 'Eczema'],
      contraindications: ['Pregnancy (first trimester)', 'Epilepsy'],
      synergies: ['Geranium', 'Lavender', 'Frankincense', 'Rose', 'Sandalwood'],
    },
    constituents: { primary: ['Carotol', 'Daucol', 'Beta-caryophyllene'], therapeuticAction: 'Cytophylactic, hepatic, hormone-balancing, anti-inflammatory' },
    metaphysical: { magicalUses: ['Fertility', 'Grounding', 'Ancestral connection', 'Patience'], affirmation: 'I am grounded in my natural beauty.', tarotCorrespondence: 'Empress - fertility, nurturing, abundance', moonPhase: 'Full Moon for fertility and abundance' },
    application: { bestMethods: ['Skincare', 'Abdominal massage', 'Diffusion', 'Bath'], dilutionGuidelines: '1-3% for skin. Excellent in face serums.', blendingTips: 'The ultimate skin oil - add to any facial blend. Combine with frankincense for anti-aging powerhouse.' },
  },

  'lemon-myrtle': {
    id: 'lemon-myrtle',
    name: 'Lemon Myrtle',
    latinName: 'Backhousia citriodora',
    element: 'air',
    chakra: 'solar-plexus',
    planets: ['Mercury', 'Sun'],
    zodiac: ['Gemini', 'Leo'],
    categories: ['antimicrobial', 'mood-uplifting', 'skin-care', 'immune-support'],
    frequency: { hz: 152, note: 'D', description: 'Bright frequency that uplifts and disinfects' },
    description: {
      short: 'Australian Lemon - potent purity and sunshine',
      scientific: 'Lemon myrtle contains 90-98% citral, the highest of any lemon-scented plant. This makes it exceptionally antimicrobial - more potent than tea tree against many pathogens. It is effective against bacteria, viruses, and fungi. Studies show it reduces stress when inhaled.',
      spiritual: 'Lemon myrtle carries the bright, cleansing energy of the Australian bush. It cuts through darkness and confusion with pure clarity. It represents the clean, clear light of the sun at its zenith.',
      physical: 'Potent antimicrobial - stronger than tea tree for many applications. Excellent for oily skin and acne. Supports immune system. Uplifting for depression and anxiety. Natural deodorant and cleaning agent.',
      mental: 'Lemon myrtle brings crystal clarity and focus. It cuts through confusion, improves concentration, and brings a sense of "everything is possible."',
      emotional: 'For those feeling depressed, stuck in negative thought patterns, or surrounded by "emotional pollution." Lemon myrtle cleanses, uplifts, and brings sunshine to the soul.',
    },
    traditionalUses: {
      cultures: ['Australian Aboriginal', 'Modern Australian'],
      history: 'Used by Australian Aboriginal people for coughs, colds, and skin conditions. Recently recognized as a powerful antimicrobial in modern aromatherapy.',
      folklore: 'Aboriginal people believed lemon myrtle cleared "bad energy" from the body and environment.',
      ceremonies: ['Cleansing rituals', 'Immune blessings', 'Mental clarity work'],
    },
    therapeutic: {
      benefits: ['Antimicrobial', 'Mood elevation', 'Skin cleansing', 'Immune support', 'Deodorant'],
      indications: ['Infections', 'Acne', 'Depression', 'Anxiety', 'Body odor', 'Household germs'],
      contraindications: ['Sensitive skin (may irritate)', 'Pregnancy (first trimester)'],
      synergies: ['Tea Tree', 'Eucalyptus', 'Lavender', 'Peppermint'],
    },
    constituents: { primary: ['Citral (90-98%)', 'Citronellal'], therapeuticAction: 'Potent antimicrobial, mood elevator, astringent' },
    metaphysical: { magicalUses: ['Cleansing', 'Clarity', 'Protection', 'Joy'], affirmation: 'I am clear, pure, and full of light.', tarotCorrespondence: 'Sun - clarity, joy, success', moonPhase: 'Full Moon for maximum clarity' },
    application: { bestMethods: ['Diffusion', 'Cleaning products', 'Skincare (low dilution)', 'Inhalation'], dilutionGuidelines: '0.5-1% for skin - very potent. Use lower dilutions than lemon.', blendingTips: 'Use sparingly - more potent than lemon. Blend with tea tree for powerful antimicrobial synergy.' },
  },

  'cinnamon-bark': {
    id: 'cinnamon-bark',
    name: 'Cinnamon Bark',
    latinName: 'Cinnamomum verum',
    element: 'fire',
    chakra: 'solar-plexus',
    planets: ['Sun', 'Mars', 'Jupiter'],
    zodiac: ['Aries', 'Leo', 'Sagittarius'],
    categories: ['antimicrobial', 'circulation', 'aphrodisiac', 'immune-support'],
    frequency: { hz: 264, note: 'C#', description: 'Powerful warming frequency that stimulates and empowers' },
    description: {
      short: 'The Spice of Kings - potent warmth and power',
      scientific: 'Cinnamon bark oil contains high levels of cinnamaldehyde (65-80%), which provides potent antimicrobial, circulatory, and warming properties. It has been shown to improve blood sugar regulation, boost circulation, and fight infections. Much stronger than cinnamon leaf oil.',
      spiritual: 'Cinnamon bark is the oil of sovereignty and power. It has been used in temple incense, sacred anointing, and royal ceremonies for millennia. It activates personal power, confidence, and the ability to manifest. It is deeply aphrodisiac, awakening passion and sensuality.',
      physical: 'Extremely potent antimicrobial - use in diffusion during illness. Powerful circulatory stimulant - warms from the inside out. Supports healthy blood sugar. Aphrodisiac properties. Natural preservative.',
      mental: 'Cinnamon bark brings confidence, mental clarity, and the courage to lead. It dispels doubt and activates personal power. Helps with decision-making and taking command.',
      emotional: 'For those feeling powerless, cold, disconnected from their passion, or lacking confidence. Cinnamon bark restores sovereignty, warmth, and sensual aliveness.',
    },
    traditionalUses: {
      cultures: ['Ancient Egypt', 'Ancient Rome', 'Traditional Chinese Medicine', 'Medieval Europe', 'Biblical Israel'],
      history: 'One of humanity\'s oldest spices, traded for over 4,000 years. Egyptians used it in embalming. Romans burned it as incense. Mentioned in the Bible as a precious oil. Medieval physicians used it for digestive and circulatory complaints.',
      folklore: 'Cinnamon was said to grow in a valley guarded by giant birds. Only those brave enough could harvest it. It was believed to attract wealth, love, and spiritual protection.',
      ceremonies: ['Sacred anointing', 'Prosperity rituals', 'Love spells', 'Protection work', 'Power rituals'],
    },
    therapeutic: {
      benefits: ['Antimicrobial', 'Circulation', 'Blood sugar support', 'Aphrodisiac', 'Warming'],
      indications: ['Cold/flu', 'Poor circulation', 'Low libido', 'Low blood sugar', 'Infections', 'Lack of confidence'],
      contraindications: ['Pregnancy', 'Children under 12', 'Sensitive skin', 'Blood clotting disorders', 'Diabetes medication'],
      synergies: ['Clove', 'Orange', 'Frankincense', 'Ylang Ylang', 'Ginger'],
    },
    constituents: { primary: ['Cinnamaldehyde (65-80%)', 'Eugenol', 'Linalool'], therapeuticAction: 'Potent antimicrobial, circulatory stimulant, hypoglycemic, aphrodisiac' },
    metaphysical: { magicalUses: ['Power', 'Prosperity', 'Love', 'Protection', 'Sacred work'], affirmation: 'I am sovereign. I claim my power.', tarotCorrespondence: 'Emperor - authority, power, sovereignty', moonPhase: 'Full Moon for maximum power' },
    application: { bestMethods: ['Diffusion', 'Inhalation', 'Very diluted massage'], dilutionGuidelines: 'Maximum 0.1% for skin - EXTREMELY potent. Use extreme caution.', blendingTips: 'Use sparingly - one of the strongest oils. Blend with sweet orange or vanilla to soften. Never use undiluted.' },
  },

  'geranium-bourbon': {
    id: 'geranium-bourbon',
    name: 'Geranium Bourbon',
    latinName: 'Pelargonium graveolens',
    element: 'water',
    chakra: 'heart',
    planets: ['Venus', 'Moon'],
    zodiac: ['Libra', 'Taurus', 'Cancer'],
    categories: ['hormone-balancing', 'skin-care', 'stress-relief', 'mood-uplifting'],
    frequency: { hz: 105, note: 'G#', description: 'Balancing frequency that harmonizes and nurtures' },
    description: {
      short: 'The Balancer - hormonal harmony and emotional equilibrium',
      scientific: 'Geranium bourbon oil contains citronellol, geraniol, and linalool. It has exceptional hormone-balancing properties, making it invaluable for PMS, menopause, and stress-related hormonal issues. Studies show it reduces anxiety and balances the nervous system. It is also excellent for all skin types.',
      spiritual: 'Geranium is the oil of the divine feminine - nurturing, balancing, and unconditionally loving. It opens and heals the heart chakra, bringing emotional equilibrium. It represents the wise mother who knows how to soothe, balance, and restore harmony.',
      physical: 'Exceptional hormone balancer - helps PMS, menopause symptoms, and stress. Balances all skin types - oily, dry, or combination. Supports adrenal function. Helps reduce fluid retention.',
      mental: 'Geranium brings mental balance and reduces overthinking. It helps with anxiety, mood swings, and emotional overwhelm. Brings a sense of "everything is okay."',
      emotional: 'For those experiencing hormonal mood swings, emotional instability, or feeling disconnected from their feminine nature. Geranium brings balance, nurturing, and emotional harmony.',
    },
    traditionalUses: {
      cultures: ['Ancient Egypt', 'Traditional European Medicine', 'Reunion Island'],
      history: 'Grown on Reunion Island (formerly Bourbon), this variety is considered the finest. Used since ancient times for skin conditions and as a rose substitute.',
      folklore: 'Geraniums were planted near windows to keep evil spirits away. The leaves were used in love spells and to promote fertility.',
      ceremonies: ['Love rituals', 'Hormonal balance work', 'Heart healing', 'Nurturing ceremonies'],
    },
    therapeutic: {
      benefits: ['Hormone balance', 'Skin health', 'Stress relief', 'Mood stabilization', 'Adrenal support'],
      indications: ['PMS', 'Menopause', 'Hormonal acne', 'Anxiety', 'Stress', 'Fluid retention'],
      contraindications: ['Pregnancy (first trimester)', 'Breastfeeding (consult provider)'],
      synergies: ['Clary Sage', 'Lavender', 'Bergamot', 'Rose', 'Sandalwood'],
    },
    constituents: { primary: ['Citronellol', 'Geraniol', 'Linalool'], therapeuticAction: 'Adaptogenic, hormone-balancing, nervine, astringent' },
    metaphysical: { magicalUses: ['Love', 'Fertility', 'Balance', 'Nurturing', 'Heart healing'], affirmation: 'I am balanced, nurtured, and whole.', tarotCorrespondence: 'Queen of Cups - emotional mastery, nurturing', moonPhase: 'Waxing Moon for growth and balance' },
    application: { bestMethods: ['Skincare', 'Diffusion', 'Bath', 'Massage', 'Inhalation'], dilutionGuidelines: '1-3% for skin. Very safe and balancing.', blendingTips: 'The ultimate balancer - add to any blend to harmonize. Combines beautifully with citrus, florals, and woods.' },
  },

  'juniper-berry': {
    id: 'juniper-berry',
    name: 'Juniper Berry',
    latinName: 'Juniperus communis',
    element: 'fire',
    chakra: 'solar-plexus',
    planets: ['Sun', 'Mars'],
    zodiac: ['Aries', 'Leo', 'Sagittarius'],
    categories: ['skin-care', 'antimicrobial', 'stress-relief', 'circulation'],
    frequency: { hz: 189, note: 'F#', description: 'Purifying frequency that cleanses and protects' },
    description: {
      short: 'The Purifier - cleansing protection and clear boundaries',
      scientific: 'Juniper berry oil contains alpha-pinene, sabinene, and myrcene. It has powerful cleansing and astringent properties for skin. It supports the body\'s natural elimination processes and is excellent for skin conditions like acne and eczema. It also has calming effects on the nervous system.',
      spiritual: 'Juniper has been used for purification and protection since ancient times. It clears negative energy, establishes healthy boundaries, and purifies spaces and auras. It is the oil of the spiritual warrior - protected, clear, and strong.',
      physical: 'Supports the body\'s natural cleansing processes. Excellent for skin conditions - acne, eczema, oily skin. Astringent properties help tone skin. Calming for stress and anxiety.',
      mental: 'Juniper brings mental clarity and the ability to "cut through" confusion. It helps establish boundaries and protects from negative influences.',
      emotional: 'For those feeling emotionally toxic, burdened by others\' energy, or lacking boundaries. Juniper cleanses, protects, and restores emotional autonomy.',
    },
    traditionalUses: {
      cultures: ['Ancient Egypt', 'Native American', 'European Folk Medicine', 'Tibetan Buddhism'],
      history: 'Used in ancient Egypt for medicinal and embalming purposes. Native Americans used it for purification. European folklore used it to ward off evil. Tibetan Buddhists use juniper incense in temple ceremonies.',
      folklore: 'Burning juniper was believed to ward off evil spirits and protect against illness. It was planted near homes for protection.',
      ceremonies: ['Purification rituals', 'Protection work', 'Space clearing', 'Boundary setting'],
    },
    therapeutic: {
      benefits: ['Skin cleansing', 'Natural elimination support', 'Fluid balance', 'Stress relief', 'Protection'],
      indications: ['Acne', 'Eczema', 'Oily skin', 'Fluid retention', 'Stress', 'Urinary issues'],
      contraindications: ['Pregnancy', 'Kidney disease', 'Breastfeeding'],
      synergies: ['Lemon', 'Cedarwood', 'Lavender', 'Grapefruit', 'Bergamot'],
    },
    constituents: { primary: ['Alpha-pinene', 'Sabinene', 'Myrcene'], therapeuticAction: 'Antimicrobial, astringent, nervine, circulatory stimulant' },
    metaphysical: { magicalUses: ['Protection', 'Purification', 'Boundary setting', 'Cleansing'], affirmation: 'I am clear, protected, and free.', tarotCorrespondence: 'Tower - clearing, purification, truth', moonPhase: 'Waning Moon for release and cleansing' },
    application: { bestMethods: ['Diffusion', 'Bath', 'Massage', 'Skincare'], dilutionGuidelines: '1-2% for skin. Avoid during pregnancy.', blendingTips: 'Blend with citrus for cleansing. Combine with cedarwood for grounding protection.' },
  },

  'patchouli-dark': {
    id: 'patchouli-dark',
    name: 'Patchouli Dark',
    latinName: 'Pogostemon cablin',
    element: 'earth',
    chakra: 'root',
    planets: ['Saturn', 'Venus'],
    zodiac: ['Capricorn', 'Taurus'],
    categories: ['grounding', 'skin-care', 'aphrodisiac', 'anti-inflammatory'],
    frequency: { hz: 94, note: 'F', description: 'Deep grounding frequency that anchors and stabilizes' },
    description: {
      short: 'The Grounding Earth - deep roots and sensual mystery',
      scientific: 'Patchouli oil contains patchoulol, alpha-bulnesene, and alpha-guaiene. The "dark" variety is aged, making it richer and more complex. It has exceptional skin-regenerating properties and is anti-inflammatory. Studies show it reduces anxiety and has mild sedative effects.',
      spiritual: 'Patchouli is the oil of deep earth connection and grounded sensuality. It anchors the spirit into the body, making it excellent for manifestation work. It represents the mystery of the dark earth - fertile, sensual, and grounding.',
      physical: 'Exceptional for skin regeneration - mature skin, scars, and wounds. Anti-inflammatory for skin and muscles. Natural deodorant and insect repellent. Aphrodisiac properties. Helps with fluid retention.',
      mental: 'Patchouli slows racing thoughts and brings present-moment awareness. It helps with overthinking, anxiety, and feeling "ungrounded." Brings mental stability.',
      emotional: 'For those feeling anxious, ungrounded, disconnected from their bodies, or struggling with sensuality. Patchouli brings earth connection, body acceptance, and sensual confidence.',
    },
    traditionalUses: {
      cultures: ['Traditional Asian Medicine', 'India', 'Middle East', 'Europe (1960s counterculture)'],
      history: 'Used in Asian traditional medicine for centuries. Became popular in Europe through trade with India. The dark variety is aged 3-5 years for deeper aroma. Famous as the scent of the 1960s counterculture.',
      folklore: 'Patchouli leaves were placed between cashmere shawls to protect them from moths during shipping to Europe, which is how the scent became associated with luxury.',
      ceremonies: ['Grounding rituals', 'Manifestation work', 'Sensual ceremonies', 'Earth connection'],
    },
    therapeutic: {
      benefits: ['Skin regeneration', 'Grounding', 'Anti-inflammatory', 'Aphrodisiac', 'Anxiety relief'],
      indications: ['Mature skin', 'Scars', 'Anxiety', 'Insomnia', 'Muscle inflammation', 'Low libido'],
      contraindications: ['None significant - very safe'],
      synergies: ['Lavender', 'Sandalwood', 'Bergamot', 'Ylang Ylang', 'Cedarwood'],
    },
    constituents: { primary: ['Patchoulol (32%)', 'Alpha-bulnesene', 'Alpha-guaiene'], therapeuticAction: 'Cytophylactic, anti-inflammatory, grounding, aphrodisiac' },
    metaphysical: { magicalUses: ['Grounding', 'Manifestation', 'Love', 'Prosperity', 'Earth connection'], affirmation: 'I am rooted, abundant, and sensual.', tarotCorrespondence: 'Pentacles suit - earth, abundance, manifestation', moonPhase: 'Dark Moon for grounding and manifestation' },
    application: { bestMethods: ['Skincare', 'Perfume', 'Diffusion', 'Massage', 'Meditation'], dilutionGuidelines: '1-3% for skin. Very safe and grounding.', blendingTips: 'The ultimate base note - anchors any blend. Improves with age like fine wine. Combine with florals for depth.' },
  },

  'clary-sage': {
    id: 'clary-sage',
    name: 'Clary Sage',
    latinName: 'Salvia sclarea',
    element: 'ether',
    chakra: 'third-eye',
    planets: ['Moon', 'Mercury'],
    zodiac: ['Cancer', 'Pisces'],
    categories: ['hormone-balancing', 'stress-relief', 'sleep-support', 'mental-clarity'],
    frequency: { hz: 98, note: 'G', description: 'Euphoric frequency that opens perception and vision' },
    description: {
      short: 'The Seer\'s Oil - clear inner vision and euphoric calm',
      scientific: 'Clary sage oil contains linalyl acetate (up to 75%), sclareol, and linalool. It has exceptional hormone-balancing properties, particularly for estrogen. Studies show it reduces cortisol levels by up to 36%, making it excellent for stress. It also has euphoric properties and can enhance dream recall and inner vision.',
      spiritual: 'Clary sage is the oil of the inner seer. It opens the third eye, enhances intuition, and brings visions during meditation and dreams. It represents the clear-seeing crone - wise, visionary, and deeply connected to inner truth.',
      physical: 'Exceptional hormone balancer - PMS, menstrual cramps, menopause symptoms. Powerful stress reliever - reduces cortisol. Supports healthy sleep. Euphoric properties lift mood. May reduce blood pressure.',
      mental: 'Clary sage brings mental clarity and expanded perception. It helps access intuition and inner wisdom. Euphoric effects can bring creative insights and "aha" moments.',
      emotional: 'For those experiencing hormonal mood swings, creative blocks, or feeling disconnected from intuition. Clary sage brings euphoria, clarity, and deep inner connection.',
    },
    traditionalUses: {
      cultures: ['Medieval Europe', 'Traditional European Medicine', 'Ayurveda'],
      history: 'Used since medieval times for female complaints and to "clear the eyes" (hence "clary" - clear eye). Added to wine and beer as a flavoring and euphoric.',
      folklore: 'Known as "muscatel sage" because it flavored wine. Believed to enhance prophetic dreams and visions.',
      ceremonies: ['Divination', 'Dream work', 'Hormonal ceremonies', 'Meditation'],
    },
    therapeutic: {
      benefits: ['Hormone balance', 'Stress relief', 'Sleep support', 'Mood elevation', 'Intuition'],
      indications: ['PMS', 'Menstrual cramps', 'Menopause', 'Anxiety', 'Insomnia', 'High blood pressure', 'Creative blocks'],
      contraindications: ['Pregnancy (avoid completely)', 'Estrogen-sensitive conditions', 'Alcohol (combined use may increase intoxication)', 'Before driving'],
      synergies: ['Geranium', 'Lavender', 'Sandalwood', 'Bergamot', 'Frankincense'],
    },
    constituents: { primary: ['Linalyl acetate (75%)', 'Sclareol', 'Linalool'], therapeuticAction: 'Euphoric, hormone-balancing, nervine, hypotensive' },
    metaphysical: { magicalUses: ['Divination', 'Dream work', 'Intuition', 'Vision', 'Hormonal wisdom'], affirmation: 'I see clearly. I trust my inner vision.', tarotCorrespondence: 'High Priestess - intuition, mystery, inner vision', moonPhase: 'Full Moon for maximum intuition' },
    application: { bestMethods: ['Diffusion', 'Bath', 'Massage', 'Inhalation', 'Meditation'], dilutionGuidelines: '1-3% for skin. Very safe for most adults.', blendingTips: 'The ultimate hormone oil. Blend with geranium for PMS. Combine with sandalwood for meditation.' },
  },

  'bergamot-fcf': {
    id: 'bergamot-fcf',
    name: 'Bergamot (FCF)',
    latinName: 'Citrus bergamia',
    element: 'air',
    chakra: 'solar-plexus',
    planets: ['Sun', 'Mercury'],
    zodiac: ['Leo', 'Libra'],
    categories: ['mood-uplifting', 'stress-relief', 'skin-care', 'antimicrobial'],
    frequency: { hz: 104, note: 'G#', description: 'Joyful frequency that lifts depression and brings sunshine' },
    description: {
      short: 'Sunshine in a Bottle - the emotional stabilizer and mood elevator',
      scientific: 'Bergamot oil contains linalyl acetate (30%), limonene, and linalool. The FCF (furocoumarin-free) variety is safe for skin without photosensitivity. It increases serotonin and dopamine levels, making it exceptional for depression. Powerful anxiolytic shown to reduce cortisol and heart rate.',
      spiritual: 'Bergamot is the oil of joyful acceptance. It helps release feelings of inadequacy and self-judgment, bringing confidence and self-love. It represents the sun shining on the soul, dispelling shadows of doubt.',
      physical: 'Excellent for skin conditions - acne, eczema, and oily skin. Supports digestive function. Eases pain and inflammation. Stimulates appetite. Uplifts while calming simultaneously.',
      mental: 'Bergamot clears the mental fog of depression and brings clarity. It helps release perfectionism and the need to please others. Brings mental freshness and optimistic perspective.',
      emotional: 'For those struggling with depression, anxiety, low self-worth, or grief. Bergamot brings joy, confidence, and emotional balance. The ultimate feel-good oil.',
    },
    traditionalUses: {
      cultures: ['Italian', 'Traditional Chinese Medicine'],
      history: 'Used in Italian folk medicine for centuries. Named after Bergamo, Italy. Earl Grey tea is flavored with bergamot. Used in traditional Chinese medicine for digestive and respiratory issues.',
      folklore: 'Believed to ward off the "evil eye" and protect from misfortune. Used in love charms to attract happiness.',
      ceremonies: ['Joy rituals', 'Self-love ceremonies', 'Sun celebrations', 'Confidence building'],
    },
    therapeutic: {
      benefits: ['Mood elevation', 'Stress relief', 'Skin healing', 'Digestive support', 'Confidence'],
      indications: ['Depression', 'Anxiety', 'Acne', 'Oily skin', 'Loss of appetite', 'Low self-esteem'],
      contraindications: ['Non-FCF bergamot causes photosensitivity', 'Store in dark bottle'],
      synergies: ['Lavender', 'Frankincense', 'Geranium', 'Ylang Ylang', 'Cedarwood'],
    },
    constituents: { primary: ['Linalyl acetate (30%)', 'Limonene', 'Linalool'], therapeuticAction: 'Antidepressant, anxiolytic, digestive, antiseptic' },
    metaphysical: { magicalUses: ['Joy', 'Confidence', 'Sun energy', 'Protection', 'Self-love'], affirmation: 'I am worthy. I am joyful. I am enough.', tarotCorrespondence: 'The Sun - joy, vitality, success', moonPhase: 'Full Moon for maximum joy' },
    application: { bestMethods: ['Diffusion', 'Perfume', 'Bath', 'Massage'], dilutionGuidelines: '2-5% for skin. FCF variety is non-photosensitive.', blendingTips: 'The ultimate mood elevator. Use as a top note. Combines beautifully with florals and woods.' },
  },

  'sweet-orange': {
    id: 'sweet-orange',
    name: 'Sweet Orange',
    latinName: 'Citrus sinensis',
    element: 'fire',
    chakra: 'sacral',
    planets: ['Sun'],
    zodiac: ['Leo', 'Sagittarius'],
    categories: ['mood-uplifting', 'stress-relief', 'immune-support', 'digestive'],
    frequency: { hz: 128, note: 'C', description: 'Bright, cheerful frequency that dispels negativity' },
    description: {
      short: 'Liquid Sunshine - pure joy, optimism, and childlike wonder',
      scientific: 'Sweet orange oil contains limonene (95%), which has demonstrated powerful mood-elevating and stress-reducing properties. It increases serotonin and dopamine levels. Strong antimicrobial properties. Limonene has been studied for its potential anti-cancer properties.',
      spiritual: 'Orange is the oil of the inner child - playful, joyful, and innocent. It reconnects us to the simple pleasures of life. Dispels negativity and brings optimism. Represents the energy of the sun radiating warmth and abundance.',
      physical: 'Boosts immunity and fights infection. Stimulates lymphatic drainage. Supports digestion and reduces nausea. Uplifts while calming the nervous system.',
      mental: 'Orange brings mental clarity and optimistic perspective. It helps release worry and overthinking. Brings a sense of playfulness and creativity.',
      emotional: 'For those feeling overwhelmed, anxious, or disconnected from joy. Orange brings lightheartedness, optimism, and emotional warmth. The ultimate comfort oil.',
    },
    traditionalUses: {
      cultures: ['Chinese', 'Mediterranean', 'Ayurveda'],
      history: 'Native to China, oranges have been cultivated for over 4,000 years. Used in traditional Chinese medicine for digestive complaints. Symbol of good fortune and prosperity.',
      folklore: 'Associated with the Chinese New Year as a symbol of good luck and prosperity. Believed to bring wealth and abundance.',
      ceremonies: ['Prosperity rituals', 'Joy ceremonies', 'New beginnings', 'Celebrations'],
    },
    therapeutic: {
      benefits: ['Mood elevation', 'Immune support', 'Digestive aid', 'Lymphatic stimulation', 'Stress relief'],
      indications: ['Depression', 'Anxiety', 'Low immunity', 'Nausea', 'Cellulite', 'Sadness'],
      contraindications: ['Photosensitivity (mild)', 'Use within 6 months of opening'],
      synergies: ['Lavender', 'Cinnamon', 'Clove', 'Frankincense', 'Peppermint'],
    },
    constituents: { primary: ['Limonene (95%)', 'Myrcene', 'Alpha-pinene'], therapeuticAction: 'Antidepressant, sedative, carminative, immunostimulant' },
    metaphysical: { magicalUses: ['Joy', 'Abundance', 'Luck', 'Purification', 'Childlike wonder'], affirmation: 'I choose joy. I am abundant. Life is beautiful.', tarotCorrespondence: 'The Fool - new beginnings, innocence, joy', moonPhase: 'Waxing Moon for growth and abundance' },
    application: { bestMethods: ['Diffusion', 'Cleaning', 'Bath', 'Massage'], dilutionGuidelines: '2-4% for skin. Very safe and gentle.', blendingTips: 'The ultimate happy oil. Mix with spices for winter blends. Combines with peppermint for energy.' },
  },

  'frankincense': {
    id: 'frankincense',
    name: 'Frankincense',
    latinName: 'Boswellia serrata',
    element: 'ether',
    chakra: 'crown',
    planets: ['Sun', 'Neptune'],
    zodiac: ['Leo', 'Sagittarius'],
    categories: ['spiritual-connection', 'mental-clarity', 'skin-care', 'immune-support', 'stress-relief'],
    frequency: { hz: 147, note: 'D', description: 'Sacred frequency that elevates consciousness and deepens meditation' },
    description: {
      short: 'The Sacred Resin - spiritual awakening and cellular regeneration',
      scientific: 'Frankincense contains boswellic acids and alpha-pinene. It has demonstrated anti-inflammatory properties comparable to NSAIDs. Promotes cellular regeneration and reduces appearance of wrinkles. Has shown promise in studies for cognitive support and potential anti-cancer properties.',
      spiritual: 'Frankincense is the oil of spiritual awakening and truth. It has been used for millennia in religious ceremonies to elevate consciousness and connect with the divine. It opens the crown chakra and facilitates deep meditation. Represents the breath of the divine.',
      physical: 'Exceptional for skin - reduces wrinkles, scars, and blemishes. Supports immune function. Anti-inflammatory for joints and muscles. Supports respiratory health. Promotes cellular regeneration.',
      mental: 'Frankincense brings deep mental clarity and spiritual perspective. It helps release limiting beliefs and past traumas. Brings the mind into present moment awareness.',
      emotional: 'For those feeling spiritually disconnected, burdened by past trauma, or seeking deeper meaning. Frankincense brings peace, spiritual connection, and emotional release.',
    },
    traditionalUses: {
      cultures: ['Ancient Egypt', 'Christian', 'Hindu', 'Buddhist', 'Islamic'],
      history: 'Used for over 5,000 years. Valued more than gold in ancient times. One of the gifts brought to Jesus. Used in Egyptian mummification. Burned in temples worldwide.',
      folklore: 'Believed to carry prayers to heaven. Used to ward off evil spirits. Associated with the Christ consciousness.',
      ceremonies: ['Meditation', 'Prayer', 'Ritual purification', 'Initiations', 'Anointing'],
    },
    therapeutic: {
      benefits: ['Cellular regeneration', 'Meditation', 'Immune support', 'Anti-inflammatory', 'Skin rejuvenation'],
      indications: ['Aging skin', 'Scars', 'Arthritis', 'Asthma', 'Anxiety', 'Spiritual seeking'],
      contraindications: ['Blood thinners (caution)', 'Pregnancy (use cautiously)'],
      synergies: ['Myrrh', 'Sandalwood', 'Lavender', 'Bergamot', 'Cedarwood'],
    },
    constituents: { primary: ['Alpha-pinene', 'Limonene', 'Boswellic acids'], therapeuticAction: 'Anti-inflammatory, cytophylactic, expectorant, sedative' },
    metaphysical: { magicalUses: ['Spiritual connection', 'Purification', 'Meditation', 'Truth', 'Higher consciousness'], affirmation: 'I am connected to the divine. I am truth. I am eternal.', tarotCorrespondence: 'The Hierophant - spiritual wisdom, tradition', moonPhase: 'Full Moon for spiritual connection' },
    application: { bestMethods: ['Diffusion', 'Meditation', 'Skincare', 'Inhalation'], dilutionGuidelines: '1-3% for skin. Safe for most people.', blendingTips: 'The ultimate spiritual oil. Use as a base note. Combines with myrrh for ancient sacred blends.' },
  },

  'peppermint': {
    id: 'peppermint',
    name: 'Peppermint',
    latinName: 'Mentha piperita',
    element: 'water',
    chakra: 'throat',
    planets: ['Mercury', 'Venus'],
    zodiac: ['Gemini', 'Virgo'],
    categories: ['mental-clarity', 'digestive', 'pain-relief', 'respiratory', 'circulation'],
    frequency: { hz: 164, note: 'E', description: 'Stimulating frequency that awakens and refreshes' },
    description: {
      short: 'The Energizer - mental clarity, digestion, and cooling relief',
      scientific: 'Peppermint contains menthol (40%) and menthone. It is a powerful digestive aid that relaxes GI muscles. Exceptional for pain relief - menthol creates a cooling sensation that distracts from pain signals. Improves focus and cognitive performance. Opens airways for respiratory support.',
      spiritual: 'Peppermint is the oil of mental clarity and purification. It cuts through confusion and brings sharp focus. It represents the cool, clear mind - awake, aware, and discerning. Used to clear stagnant energy.',
      physical: 'Exceptional digestive aid - nausea, bloating, IBS. Powerful pain reliever - headaches, muscle pain. Opens airways for breathing. Cools fever. Increases alertness and reduces fatigue.',
      mental: 'Peppermint brings instant mental clarity and focus. It cuts through brain fog and fatigue. Enhances memory and cognitive performance. The ultimate study and work oil.',
      emotional: 'For those feeling mentally fatigued, confused, or sluggish. Peppermint brings alertness, clarity, and renewed energy. Cools anger and frustration.',
    },
    traditionalUses: {
      cultures: ['Ancient Greek', 'Roman', 'Traditional Chinese Medicine', 'Ayurveda'],
      history: 'Used since ancient times. Named after the Greek nymph Minthe. Used in Egyptian temples. Cultivated in England since the 18th century.',
      folklore: 'Associated with hospitality in Greek and Roman cultures. Believed to increase vibrations and psychic abilities.',
      ceremonies: ['Mental clarity rituals', 'Purification', 'Study rituals', 'Energy work'],
    },
    therapeutic: {
      benefits: ['Mental clarity', 'Digestive support', 'Pain relief', 'Respiratory support', 'Cooling'],
      indications: ['Headaches', 'Nausea', 'Indigestion', 'Fatigue', 'Congestion', 'Muscle pain'],
      contraindications: ['Children under 6 (toxic)', 'Cardiac fibrillation', 'Avoid near eyes'],
      synergies: ['Lavender', 'Eucalyptus', 'Lemon', 'Rosemary', 'Tea Tree'],
    },
    constituents: { primary: ['Menthol (40%)', 'Menthone', 'Menthyl acetate'], therapeuticAction: 'Analgesic, digestive, stimulant, decongestant' },
    metaphysical: { magicalUses: ['Mental clarity', 'Energy', 'Purification', 'Protection', 'Alertness'], affirmation: 'I am awake. I am focused. I am powerful.', tarotCorrespondence: 'The Magician - mastery, focus, manifestation', moonPhase: 'Waxing Moon for mental power' },
    application: { bestMethods: ['Inhalation', 'Topical (low dilution)', 'Diffusion', 'Bath'], dilutionGuidelines: '0.5-2% for skin. Very potent - use sparingly.', blendingTips: 'The ultimate energizer. Use small amounts. Combines with lavender for headaches.' },
  },

  'grapefruit': {
    id: 'grapefruit',
    name: 'Pink Grapefruit',
    latinName: 'Citrus paradisi',
    element: 'fire',
    chakra: 'solar-plexus',
    planets: ['Sun'],
    zodiac: ['Leo', 'Aries'],
    categories: ['mood-uplifting', 'stress-relief', 'skin-care', 'digestive', 'circulation'],
    frequency: { hz: 134, note: 'C#', description: 'Energizing frequency that boosts metabolism and mood' },
    description: {
      short: 'The Energizing Citrus - metabolism booster and emotional balancer',
      scientific: 'Grapefruit oil contains limonene (90%) and nootkatone. It has demonstrated metabolism-boosting and fat-burning properties. Uplifts mood while calming stress. Supports lymphatic drainage. Antimicrobial and cleansing for skin.',
      spiritual: 'Grapefruit is the oil of self-love and body appreciation. It helps release self-criticism and embrace the physical self. It represents the joy of embodiment and living fully in the present moment.',
      physical: 'Boosts metabolism and supports weight management. Stimulates lymphatic drainage. Uplifting for depression. Supports healthy digestion. Cleansing for oily skin and cellulite.',
      mental: 'Grapefruit brings mental refreshment and optimistic perspective. It helps release negative self-talk and criticism. Brings clarity and focus.',
      emotional: 'For those struggling with body image, self-criticism, or emotional eating. Grapefruit brings self-acceptance, joy, and emotional lightness.',
    },
    traditionalUses: {
      cultures: ['Caribbean', 'Traditional Chinese Medicine'],
      history: 'A relatively recent citrus hybrid discovered in Barbados in the 18th century. Used in traditional Caribbean medicine. Popularized in aromatherapy in the 20th century.',
      folklore: 'Associated with the sun and abundance. Believed to attract prosperity and good fortune.',
      ceremonies: ['Self-love rituals', 'New Moon intentions', 'Body appreciation', 'Prosperity work'],
    },
    therapeutic: {
      benefits: ['Mood elevation', 'Metabolism support', 'Lymphatic drainage', 'Skin cleansing', 'Stress relief'],
      indications: ['Depression', 'Low metabolism', 'Cellulite', 'Oily skin', 'Lymphatic congestion', 'Emotional eating'],
      contraindications: ['Photosensitivity', 'Certain medications (check interactions)', 'Use within 6 months'],
      synergies: ['Lavender', 'Cypress', 'Juniper', 'Bergamot', 'Cedarwood'],
    },
    constituents: { primary: ['Limonene (90%)', 'Nootkatone', 'Myrcene'], therapeuticAction: 'Stimulant, antidepressant, diuretic, lymphatic' },
    metaphysical: { magicalUses: ['Self-love', 'Abundance', 'Energy', 'Body positivity', 'New beginnings'], affirmation: 'I love myself. I am vibrant. I am enough.', tarotCorrespondence: 'Empress - abundance, beauty, self-love', moonPhase: 'New Moon for new beginnings' },
    application: { bestMethods: ['Diffusion', 'Massage (cellulite)', 'Bath', 'Inhalation'], dilutionGuidelines: '2-4% for skin. Photosensitive - avoid sun after application.', blendingTips: 'The ultimate body-positive oil. Use in body oils for lymphatic massage. Combines with cypress for cellulite blends.' },
  },

  'cedarwood': {
    id: 'cedarwood',
    name: 'Cedarwood Atlas',
    latinName: 'Cedrus atlantica',
    element: 'earth',
    chakra: 'root',
    planets: ['Saturn', 'Sun'],
    zodiac: ['Capricorn', 'Leo'],
    categories: ['grounding', 'sleep-support', 'skin-care', 'respiratory', 'spiritual-connection'],
    frequency: { hz: 88, note: 'F', description: 'Grounding frequency that anchors and stabilizes' },
    description: {
      short: 'The Wisdom Tree - ancient grounding and spiritual strength',
      scientific: 'Cedarwood contains cedrol, beta-cedrene, and thujopsene. It has demonstrated sedative properties that support sleep. Anti-inflammatory and antiseptic for skin and respiratory issues. Insect-repellent properties. Grounding aromatherapy effects shown to reduce anxiety.',
      spiritual: 'Cedarwood is the oil of ancient wisdom and spiritual strength. It has been used for millennia in temples and ceremonies. It grounds the spirit while elevating consciousness. Represents the strength and wisdom of the eternal tree.',
      physical: 'Supports healthy sleep and reduces anxiety. Excellent for skin - acne, eczema, oily skin. Decongestant for respiratory issues. Natural insect repellent. Promotes hair growth.',
      mental: 'Cedarwood brings mental clarity through grounding. It helps organize scattered thoughts and brings focus. Supports decision-making and wisdom.',
      emotional: 'For those feeling scattered, anxious, or disconnected. Cedarwood brings grounding, stability, and inner strength. Helps process grief and difficult emotions.',
    },
    traditionalUses: {
      cultures: ['Ancient Egypt', 'Hebrew', 'Native American', 'Tibetan'],
      history: 'Used for over 3,000 years. Cedar of Lebanon mentioned in the Bible. Egyptians used it in mummification. Native Americans used it in purification ceremonies. Temples built from cedar.',
      folklore: 'Sacred to the gods in many cultures. Believed to grant eternal life. Used to build Solomon\'s Temple. Associated with ancestral wisdom.',
      ceremonies: ['Grounding rituals', 'Meditation', 'Ancestral work', 'Protection', 'Sleep ceremonies'],
    },
    therapeutic: {
      benefits: ['Sleep support', 'Grounding', 'Skin healing', 'Respiratory support', 'Anxiety relief'],
      indications: ['Insomnia', 'Anxiety', 'Acne', 'Eczema', 'Hair loss', 'Congestion'],
      contraindications: ['Pregnancy (use cautiously)', 'High blood pressure'],
      synergies: ['Lavender', 'Frankincense', 'Sandalwood', 'Rosemary', 'Cypress'],
    },
    constituents: { primary: ['Cedrol', 'Beta-cedrene', 'Thujopsene'], therapeuticAction: 'Sedative, antiseptic, expectorant, astringent' },
    metaphysical: { magicalUses: ['Grounding', 'Protection', 'Ancestral connection', 'Wisdom', 'Longevity'], affirmation: 'I am grounded. I am strong. I am wise.', tarotCorrespondence: 'King of Pentacles - mastery, stability, abundance', moonPhase: 'Dark Moon for grounding and release' },
    application: { bestMethods: ['Diffusion', 'Meditation', 'Skincare', 'Hair care'], dilutionGuidelines: '1-3% for skin. Very safe and grounding.', blendingTips: 'The ultimate grounding oil. Use as a base note. Combines with frankincense for deep meditation.' },
  },

  'ylang-ylang': {
    id: 'ylang-ylang',
    name: 'Ylang Ylang',
    latinName: 'Cananga odorata',
    element: 'water',
    chakra: 'heart',
    planets: ['Venus', 'Moon'],
    zodiac: ['Taurus', 'Libra', 'Pisces'],
    categories: ['aphrodisiac', 'stress-relief', 'mood-uplifting', 'skin-care', 'hormone-balancing'],
    frequency: { hz: 128, note: 'C', description: 'Heart-opening frequency that promotes love and emotional healing' },
    description: {
      short: 'The Flower of Flowers - exotic sensuality and heart-centered joy',
      scientific: 'Ylang Ylang contains linalool, geranyl acetate, caryophyllene, and benzyl acetate. It has demonstrated anxiolytic and antidepressant effects through serotonergic and dopaminergic modulation. Lowers blood pressure and heart rate. Balances sebum production for all skin types.',
      spiritual: 'Ylang Ylang is the oil of the Divine Feminine and heart-centered sensuality. It opens the heart chakra while grounding the sacral, creating a flow of love and pleasure through the body. Used in Indonesian wedding ceremonies where petals are scattered on the marriage bed. It represents the joy of embodiment and sacred sexuality.',
      physical: 'Calms the nervous system and reduces anxiety. Balances skin - both oily and dry. Supports healthy blood pressure. Eases PMS and menstrual discomfort. Aphrodisiac properties enhance libido.',
      mental: 'Ylang Ylang quiets mental chatter and brings present-moment awareness. It helps release negative thought patterns and self-criticism. Supports emotional intelligence and intuition.',
      emotional: 'For those who have shut down emotionally or struggle with intimacy. Ylang Ylang opens the heart, heals emotional wounds, and awakens joy. It helps release anger and resentment, replacing them with compassion and sensuality.',
    },
    traditionalUses: {
      cultures: ['Indonesia', 'Philippines', 'Madagascar', 'Traditional Chinese Medicine'],
      history: 'Used for centuries in tropical Asia. The name means "flower of flowers" in Tagalog. Traditional Indonesian wedding ritual involves scattering petals on the marriage bed. Madagascar became the premier source in the 20th century.',
      folklore: 'Believed to attract love and enhance beauty. Used in love potions and aphrodisiac blends. Associated with the goddess of love in various traditions.',
      ceremonies: ['Wedding rituals', 'Love ceremonies', 'Heart healing', 'Self-love practices', 'Intimacy rituals'],
    },
    therapeutic: {
      benefits: ['Aphrodisiac', 'Heart-opener', 'Stress relief', 'Skin balancer', 'Mood elevator'],
      indications: ['Anxiety', 'Depression', 'Low libido', 'Oily skin', 'Dry skin', 'PMS', 'High blood pressure', 'Emotional withdrawal'],
      contraindications: ['Use sparingly - strong scent can cause headaches', 'Low blood pressure (may lower further)', 'First trimester pregnancy'],
      synergies: ['Lavender', 'Bergamot', 'Sandalwood', 'Jasmine', 'Rose', 'Orange', 'Patchouli'],
    },
    constituents: { primary: ['Linalool (15%)', 'Geranyl acetate (12%)', 'Caryophyllene', 'Benzyl acetate'], therapeuticAction: 'Antidepressant, antiseptic, aphrodisiac, nervine, balancer' },
    metaphysical: { magicalUses: ['Love attraction', 'Sensuality', 'Heart healing', 'Beauty', 'Emotional balance'], affirmation: 'I am worthy of love and pleasure. My heart is open.', tarotCorrespondence: 'Lovers - union, choice, heart-centeredness', moonPhase: 'Full Moon for love and manifestation' },
    application: { bestMethods: ['Diffusion', 'Perfume', 'Bath', 'Massage', 'Inhalation'], dilutionGuidelines: '0.5-1% for skin - very potent. Use sparingly.', blendingTips: 'Use as a heart note in perfumes. Combines with citrus for joyful blends, with woods for grounding sensuality. A little goes a long way.' },
  },

  'rosemary': {
    id: 'rosemary',
    name: 'Rosemary CT Cineole',
    latinName: 'Rosmarinus officinalis',
    element: 'fire',
    chakra: 'third-eye',
    planets: ['Sun', 'Mercury'],
    zodiac: ['Leo', 'Aries', 'Gemini'],
    categories: ['mental-clarity', 'respiratory', 'circulation', 'immune-support', 'memory-support'],
    frequency: { hz: 144, note: 'D', description: 'Mental stimulation frequency that enhances cognition and memory' },
    description: {
      short: 'The Dew of the Sea - mental clarity and remembrance',
      scientific: 'Rosemary CT Cineole contains 1,8-cineole (45-55%), alpha-pinene, and camphor. The cineole content has demonstrated significant cognitive enhancement effects, improving memory and concentration. Increases acetylcholine levels in the brain. Strong antioxidant and antimicrobial properties. Supports respiratory function through bronchodilation.',
      spiritual: 'Rosemary is the oil of remembrance and mental clarity. Since ancient Greece, students wore rosemary garlands while studying. It opens the third eye while activating the solar plexus, creating focused, purposeful energy. Associated with the Sun and mental illumination.',
      physical: 'Enhances memory and cognitive function. Supports respiratory health - excellent for congestion and breathing. Stimulates circulation and warms cold extremities. Supports hair growth and scalp health. Natural antioxidant.',
      mental: 'Rosemary is the ultimate study and work oil. It cuts through mental fog, improves focus, and enhances memory retention. Brings clarity without the jitters of caffeine. Ideal for mental tasks, exams, and creative work.',
      emotional: 'For those feeling mentally sluggish, forgetful, or lacking direction. Rosemary brings mental vitality, confidence, and clarity of purpose. Helps release mental fatigue and procrastination.',
    },
    traditionalUses: {
      cultures: ['Ancient Greece', 'Ancient Rome', 'Medieval Europe', 'Mediterranean'],
      history: 'Sacred to the Greeks and Romans. Students wore garlands for memory. Used in medieval Europe to ward off evil and protect against plague. Shakespeare referenced it in Hamlet: "Rosemary, that\'s for remembrance."',
      folklore: 'Associated with memory and fidelity. Brides wore rosemary for remembrance. Believed to grow only in gardens of the righteous. Used in protection rituals.',
      ceremonies: ['Study rituals', 'Memory work', 'Mental clarity', 'Protection', 'Graduation ceremonies'],
    },
    therapeutic: {
      benefits: ['Memory enhancement', 'Mental clarity', 'Respiratory support', 'Circulation', 'Hair growth'],
      indications: ['Poor concentration', 'Memory loss', 'Mental fatigue', 'Congestion', 'Low blood pressure', 'Hair thinning', 'Cold extremities'],
      contraindications: ['Epilepsy', 'High blood pressure', 'Pregnancy', 'Avoid before sleep (stimulating)'],
      synergies: ['Lavender', 'Peppermint', 'Lemon', 'Eucalyptus', 'Cedarwood', 'Basil'],
    },
    constituents: { primary: ['1,8-Cineole (45-55%)', 'Alpha-pinene', 'Camphor', 'Camphene'], therapeuticAction: 'Stimulant, expectorant, circulatory, nervine, antioxidant' },
    metaphysical: { magicalUses: ['Memory', 'Mental clarity', 'Protection', 'Purification', 'Youth'], affirmation: 'My mind is clear. My memory is sharp. I am focused.', tarotCorrespondence: 'Magician - manifestation, mental clarity, skill', moonPhase: 'Waxing Moon for growth and mental expansion' },
    application: { bestMethods: ['Diffusion', 'Inhalation', 'Hair care', 'Massage (circulation)'], dilutionGuidelines: '1-3% for skin. Avoid before bedtime.', blendingTips: 'Use with lemon and peppermint for study blend. Combine with cedarwood for grounded focus. Excellent in hair rinses and scalp treatments.' },
  },
}

// Helper function to get oil wisdom
export function getOilWisdom(id: string): OilWisdomProfile | undefined {
  return OIL_WISDOM[id as OilWisdomId]
}

// Helper to filter oils by category
export function getOilsByCategory(category: OilCategory): string[] {
  return Object.values(OIL_WISDOM)
    .filter((oil): oil is OilWisdomProfile => oil !== undefined && oil.categories.includes(category))
    .map(oil => oil.id)
}

// Get all categories for an oil
export function getOilCategories(id: string): OilCategory[] {
  return OIL_WISDOM[id as OilWisdomId]?.categories || []
}

// Get all oil IDs
export function getAllOilIds(): OilWisdomId[] {
  return Object.keys(OIL_WISDOM) as OilWisdomId[]
}

// Get oil by name (case insensitive partial match)
export function findOilByName(name: string): OilWisdomProfile | undefined {
  const search = name.toLowerCase()
  return Object.values(OIL_WISDOM).find((oil): oil is OilWisdomProfile => 
    oil !== undefined && (
      oil.name.toLowerCase().includes(search) || 
      oil.latinName.toLowerCase().includes(search)
    )
  )
}
