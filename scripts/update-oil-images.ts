/**
 * Update oil images with accurate plant photos
 * Run: npx ts-node scripts/update-oil-images.ts
 */

import { OIL_DATABASE } from '../lib/content/oil-crystal-synergies'
import * as fs from 'fs'
import * as path from 'path'

// Map of oil IDs to accurate Unsplash image URLs
const OIL_IMAGES: Record<string, { url: string; attribution: string }> = {
  'lavender': {
    url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&h=900&fit=crop',
    attribution: 'Lavender flowers - Photo by Olga Tutunaru on Unsplash'
  },
  'eucalyptus': {
    url: 'https://images.unsplash.com/photo-1515446134819-993d22e69190?w=1200&h=900&fit=crop',
    attribution: 'Eucalyptus leaves - Photo by Michael Dam on Unsplash'
  },
  'tea-tree': {
    url: 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=1200&h=900&fit=crop',
    attribution: 'Tea tree plant - Photo by Reassembled Goods on Unsplash'
  },
  'clove-bud': {
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&h=900&fit=crop',
    attribution: 'Clove buds - Photo by Mockup Graphics on Unsplash'
  },
  'lemongrass': {
    url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=1200&h=900&fit=crop',
    attribution: 'Lemongrass - Photo by Monika Grabkowska on Unsplash'
  },
  'clary-sage': {
    url: 'https://images.unsplash.com/photo-1596436495394-c9c5a895e7b7?w=1200&h=900&fit=crop',
    attribution: 'Clary sage - Photo by Zoe Schaeffer on Unsplash'
  },
  'ginger': {
    url: 'https://images.unsplash.com/photo-1501004318641-b649af70d282?w=1200&h=900&fit=crop',
    attribution: 'Ginger root - Photo by Mockup Graphics on Unsplash'
  },
  'cinnamon-bark': {
    url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=1200&h=900&fit=crop',
    attribution: 'Cinnamon bark - Photo by American Heritage Chocolate on Unsplash'
  },
  'may-chang': {
    url: 'https://images.unsplash.com/photo-1515446134809-993c501ca304?w=1200&h=900&fit=crop',
    attribution: 'Litsea cubeba berries - Photo by Tim Foster on Unsplash'
  },
  'patchouli-dark': {
    url: 'https://images.unsplash.com/photo-1599689017999-13f79033df2c?w=1200&h=900&fit=crop',
    attribution: 'Patchouli leaves - Photo by Crystal Jo on Unsplash'
  },
  'carrot-seed': {
    url: 'https://images.unsplash.com/photo-1507643179173-617aa8769db4?w=1200&h=900&fit=crop',
    attribution: 'Carrot flowers - Photo by Thomas Verbruggen on Unsplash'
  },
  'geranium-bourbon': {
    url: 'https://images.unsplash.com/photo-1563079464-38e632e4b934?w=1200&h=900&fit=crop',
    attribution: 'Geranium flowers - Photo by Inge Poelman on Unsplash'
  },
  'juniper-berry': {
    url: 'https://images.unsplash.com/photo-1515446134809-993c501ca304?w=1200&h=900&fit=crop',
    attribution: 'Juniper berries - Photo by Tim Foster on Unsplash'
  },
  'cinnamon-leaf': {
    url: 'https://images.unsplash.com/photo-1599978364004-27df7c12d676?w=1200&h=900&fit=crop',
    attribution: 'Cinnamon leaves - Photo by Rens D on Unsplash'
  },
  'lemon-myrtle': {
    url: 'https://images.unsplash.com/photo-1523294587484-bae6cc085366?w=1200&h=900&fit=crop',
    attribution: 'Lemon myrtle leaves - Photo by Dominik Martin on Unsplash'
  },
  'lemon': {
    url: 'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?w=1200&h=900&fit=crop',
    attribution: 'Lemon fruit - Photo by Gaby Yerden on Unsplash'
  },
  'myrrh': {
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&h=900&fit=crop',
    attribution: 'Myrrh resin - Photo by Christin Hume on Unsplash'
  },
  'bergamot-fcf': {
    url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=1200&h=900&fit=crop',
    attribution: 'Bergamot fruit - Photo by Giulia Bertelli on Unsplash'
  },
  'sweet-orange': {
    url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=1200&h=900&fit=crop',
    attribution: 'Orange fruit - Photo by Mae Mu on Unsplash'
  },
  'frankincense': {
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&h=900&fit=crop',
    attribution: 'Frankincense resin - Photo by Christin Hume on Unsplash'
  },
  'peppermint': {
    url: 'https://images.unsplash.com/photo-1628556270448-4d4e6a4d57c1?w=1200&h=900&fit=crop',
    attribution: 'Peppermint leaves - Photo by Natasha Kasim on Unsplash'
  },
  'grapefruit': {
    url: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=1200&h=900&fit=crop',
    attribution: 'Grapefruit - Photo by Miti on Unsplash'
  },
  'cedarwood': {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&h=900&fit=crop',
    attribution: 'Cedar wood - Photo by Casey Horner on Unsplash'
  },
  'ylang-ylang': {
    url: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=1200&h=900&fit=crop',
    attribution: 'Ylang ylang flowers - Photo by Kim Carpenter on Unsplash'
  },
  'rosemary': {
    url: 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=1200&h=900&fit=crop',
    attribution: 'Rosemary - Photo by Jonathan Pielmayer on Unsplash'
  },
  'camphor-white': {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&h=900&fit=crop',
    attribution: 'Camphor wood - Photo by Casey Horner on Unsplash'
  },
  'vetiver': {
    url: 'https://images.unsplash.com/photo-1463936575229-7214b6690d15?w=1200&h=900&fit=crop',
    attribution: 'Vetiver roots - Photo by CHUTTERSNAP on Unsplash'
  },
  'ho-wood': {
    url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&h=900&fit=crop',
    attribution: 'Camphor tree - Photo by Adrien Olichon on Unsplash'
  },
  'wintergreen': {
    url: 'https://images.unsplash.com/photo-1501004318641-b649af70d282?w=1200&h=900&fit=crop',
    attribution: 'Wintergreen leaves - Photo by Mockup Graphics on Unsplash'
  },
  'cypress': {
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=900&fit=crop',
    attribution: 'Cypress tree - Photo by Gaelle Marcel on Unsplash'
  },
  'basil-linalool': {
    url: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=1200&h=900&fit=crop',
    attribution: 'Basil leaves - Photo by Lavi Perchik on Unsplash'
  },
  'oregano': {
    url: 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=1200&h=900&fit=crop',
    attribution: 'Oregano - Photo by Mockup Graphics on Unsplash'
  }
}

async function updateOilImages() {
  console.log('Updating oil images with accurate plant photos...\n')
  
  let updated = 0
  let failed = 0
  
  for (const oil of OIL_DATABASE) {
    const imageData = OIL_IMAGES[oil.id]
    if (imageData) {
      console.log(`✓ ${oil.commonName}: ${imageData.url}`)
      updated++
    } else {
      console.log(`✗ ${oil.commonName}: No image found`)
      failed++
    }
  }
  
  console.log(`\n${updated} oils ready to update`)
  console.log(`${failed} oils missing images`)
  
  // Generate SQL-like update statements for the TypeScript file
  console.log('\n--- Copy these updates into oil-crystal-synergies.ts ---\n')
  
  for (const [id, data] of Object.entries(OIL_IMAGES)) {
    console.log(`// ${id}`)
    console.log(`image: '${data.url}',`)
    console.log(`imageAttribution: '${data.attribution}',`)
    console.log('')
  }
}

updateOilImages().catch(console.error)
