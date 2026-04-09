/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CODEX PDF GENERATION API
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Generates beautiful, styled PDFs of the Living Blend Codex
 * and handles email delivery for sharing.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server'

interface CodexData {
  name: string
  soulHash: string
  uniquenessScore: number
  essence: string
  aura: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
  composition: {
    oils: Array<{
      name: string
      ml: number
      percentage: number
    }>
    elemental: {
      fire: number
      water: number
      earth: number
      air: number
      dominant: string
    }
    noteDistribution: {
      top: number
      heart: number
      base: number
    }
    vibrationalFrequency: number
  }
  crystal: {
    name: string
    verb: string
    amplifies: string[]
    frequencyShift: number
  }
  cord: {
    name: string
    verb: string
    effect: string
    duration: string
  }
  carrier: {
    name: string
    absorption: string
    extendsNotes: string
    feel: string
  }
  therapeuticScores: Record<string, number>
  bestFor: string[]
  applicationMethods: Array<{
    method: string
    suitability: number
    instructions: string
  }>
  timing: {
    timeOfDay: string[]
    season: string
    lunarPhase: string
    maturation: {
      peakDay: number
      character: string
      shelfLife: string
    }
  }
  safety: {
    level: 'safe' | 'caution' | 'warning'
    phototoxic: boolean
    pregnancySafe: boolean
    ageRestriction?: string
    contraindications: string[]
  }
  ritual: {
    intention: string
    application: string
    storage: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const { codex, action, email } = await request.json()
    
    if (!codex) {
      return NextResponse.json({ error: 'Codex data required' }, { status: 400 })
    }

    // Generate the styled HTML for PDF
    const html = generateCodexHTML(codex)
    
    if (action === 'generate') {
      // Return HTML for client-side PDF generation
      return NextResponse.json({ html, codex })
    }
    
    if (action === 'email' && email) {
      // For email, we'd integrate with SendGrid/Resend/etc
      // For now, return the HTML that can be sent
      return NextResponse.json({ 
        success: true, 
        message: `Codex "${codex.name}" ready to send to ${email}`,
        html,
        codex
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

function generateCodexHTML(codex: CodexData): string {
  const topTherapeutic = Object.entries(codex.therapeuticScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${codex.name} - Living Blend Codex</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #0a080c 0%, #151219 100%);
      color: #f5f3ef;
      line-height: 1.6;
      padding: 40px;
      min-height: 100vh;
    }
    
    .codex-container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 0 60px ${codex.aura.primaryColor}15;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .soul-hash {
      display: inline-block;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: #c9a227;
      margin-bottom: 16px;
    }
    
    h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 42px;
      font-weight: 400;
      color: #f5f3ef;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    
    .meta {
      font-size: 13px;
      color: rgba(245, 243, 239, 0.5);
    }
    
    .meta span {
      margin: 0 12px;
    }
    
    .uniqueness {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(201, 162, 39, 0.15);
      border-radius: 20px;
      font-size: 11px;
      color: #c9a227;
      font-weight: 500;
      margin-left: 12px;
    }
    
    .section {
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: rgba(245, 243, 239, 0.4);
      margin-bottom: 16px;
      font-weight: 500;
    }
    
    .essence {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px;
      line-height: 1.7;
      color: rgba(245, 243, 239, 0.9);
      font-style: italic;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 24px;
    }
    
    .card h3 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(245, 243, 239, 0.4);
      margin-bottom: 16px;
      font-weight: 500;
    }
    
    .elemental-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .elemental-name {
      width: 50px;
      font-size: 12px;
      color: rgba(245, 243, 239, 0.6);
      text-transform: capitalize;
    }
    
    .elemental-bar {
      flex: 1;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      margin: 0 12px;
    }
    
    .elemental-fill {
      height: 100%;
      border-radius: 2px;
    }
    
    .elemental-value {
      width: 30px;
      font-size: 11px;
      color: rgba(245, 243, 239, 0.4);
      text-align: right;
    }
    
    .oil-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      font-size: 13px;
    }
    
    .oil-item:last-child {
      border-bottom: none;
    }
    
    .oil-name {
      color: rgba(245, 243, 239, 0.8);
    }
    
    .oil-meta {
      color: rgba(245, 243, 239, 0.4);
      font-size: 11px;
    }
    
    .oil-percentage {
      color: #c9a227;
      font-weight: 500;
      margin-left: 8px;
    }
    
    .component-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    
    .component-card h4 {
      font-size: 14px;
      color: rgba(245, 243, 239, 0.9);
      margin-bottom: 6px;
      font-weight: 500;
    }
    
    .component-card p {
      font-size: 12px;
      color: rgba(245, 243, 239, 0.5);
      line-height: 1.6;
    }
    
    .therapeutic-item {
      margin-bottom: 12px;
    }
    
    .therapeutic-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 6px;
    }
    
    .therapeutic-name {
      color: rgba(245, 243, 239, 0.7);
    }
    
    .therapeutic-value {
      color: rgba(245, 243, 239, 0.4);
    }
    
    .therapeutic-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .therapeutic-fill {
      height: 100%;
      background: #c9a227;
      border-radius: 3px;
    }
    
    .therapeutic-fill.low {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .application-card {
      background: rgba(201, 162, 39, 0.08);
      border: 1px solid rgba(201, 162, 39, 0.2);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }
    
    .application-card.alt {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.08);
    }
    
    .application-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    
    .application-name {
      font-size: 13px;
      color: #c9a227;
      font-weight: 500;
    }
    
    .application-card.alt .application-name {
      color: rgba(245, 243, 239, 0.8);
    }
    
    .application-match {
      font-size: 11px;
      color: rgba(245, 243, 239, 0.4);
    }
    
    .application-instructions {
      font-size: 11px;
      color: rgba(245, 243, 239, 0.5);
      line-height: 1.5;
    }
    
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .info-card {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%);
      border: 1px solid rgba(99, 102, 241, 0.15);
      border-radius: 16px;
      padding: 24px;
    }
    
    .info-card.safety {
      background: linear-gradient(135deg, ${codex.safety.level === 'safe' ? 'rgba(16, 185, 129, 0.08)' : codex.safety.level === 'caution' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)'} 0%, transparent 100%);
      border-color: ${codex.safety.level === 'safe' ? 'rgba(16, 185, 129, 0.15)' : codex.safety.level === 'caution' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
    }
    
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .info-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    
    .info-label {
      font-size: 11px;
      color: rgba(245, 243, 239, 0.4);
      margin-bottom: 2px;
    }
    
    .info-value {
      font-size: 13px;
      color: rgba(245, 243, 239, 0.85);
    }
    
    .safety-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    
    .safety-badge.safe {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
    
    .safety-badge.caution {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }
    
    .safety-badge.warning {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }
    
    .caution-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12px;
      color: rgba(245, 243, 239, 0.6);
      margin-bottom: 8px;
    }
    
    .caution-icon {
      color: #f59e0b;
      font-size: 12px;
    }
    
    .ritual-card {
      background: linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(120, 53, 15, 0.05) 100%);
      border: 1px solid rgba(201, 162, 39, 0.2);
      border-radius: 16px;
      padding: 28px;
    }
    
    .ritual-section {
      margin-bottom: 20px;
    }
    
    .ritual-section:last-child {
      margin-bottom: 0;
      padding-top: 20px;
      border-top: 1px solid rgba(201, 162, 39, 0.15);
    }
    
    .ritual-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(245, 243, 239, 0.4);
      margin-bottom: 6px;
    }
    
    .ritual-intention {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px;
      font-style: italic;
      color: rgba(245, 243, 239, 0.9);
      line-height: 1.5;
    }
    
    .ritual-text {
      font-size: 13px;
      color: rgba(245, 243, 239, 0.7);
      line-height: 1.6;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .footer-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px;
      color: #c9a227;
      margin-bottom: 4px;
    }
    
    .footer-tagline {
      font-size: 11px;
      color: rgba(245, 243, 239, 0.4);
    }
    
    .best-for-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }
    
    .tag {
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      font-size: 11px;
      color: rgba(245, 243, 239, 0.7);
    }
    
    @media print {
      body {
        background: #0a080c;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="codex-container">
    <!-- Header -->
    <div class="header">
      <div class="soul-hash">${codex.soulHash}</div>
      <h1>${codex.name}</h1>
      <div class="meta">
        ${codex.composition.vibrationalFrequency}Hz
        <span>•</span>
        ${codex.composition.oils.length} Oils
        <span class="uniqueness">${codex.uniquenessScore}% Unique</span>
      </div>
    </div>
    
    <!-- The Essence -->
    <div class="section">
      <div class="section-title">The Essence</div>
      <p class="essence">${codex.essence}</p>
    </div>
    
    <!-- Composition Grid -->
    <div class="section">
      <div class="section-title">Composition</div>
      <div class="grid">
        <!-- Elemental -->
        <div class="card">
          <h3>Elemental Nature</h3>
          <div class="elemental-item">
            <span class="elemental-name">Fire</span>
            <div class="elemental-bar">
              <div class="elemental-fill" style="width: ${codex.composition.elemental.fire}%; background: #dc2626;"></div>
            </div>
            <span class="elemental-value">${Math.round(codex.composition.elemental.fire)}%</span>
          </div>
          <div class="elemental-item">
            <span class="elemental-name">Water</span>
            <div class="elemental-bar">
              <div class="elemental-fill" style="width: ${codex.composition.elemental.water}%; background: #0891b2;"></div>
            </div>
            <span class="elemental-value">${Math.round(codex.composition.elemental.water)}%</span>
          </div>
          <div class="elemental-item">
            <span class="elemental-name">Earth</span>
            <div class="elemental-bar">
              <div class="elemental-fill" style="width: ${codex.composition.elemental.earth}%; background: #92400e;"></div>
            </div>
            <span class="elemental-value">${Math.round(codex.composition.elemental.earth)}%</span>
          </div>
          <div class="elemental-item">
            <span class="elemental-name">Air</span>
            <div class="elemental-bar">
              <div class="elemental-fill" style="width: ${codex.composition.elemental.air}%; background: #e0f2fe;"></div>
            </div>
            <span class="elemental-value">${Math.round(codex.composition.elemental.air)}%</span>
          </div>
        </div>
        
        <!-- Notes -->
        <div class="card">
          <h3>Aromatic Structure</h3>
          <div class="elemental-item">
            <span class="elemental-name">Top</span>
            <div class="elemental-bar">
              <div class="elemental-fill" style="width: ${codex.composition.noteDistribution.top}%; background: #fbbf24;"></div>
            </div>
            <span class="elemental-value">${Math.round(codex.composition.noteDistribution.top)}%</span>
          </div>
          <div class="elemental-item">
            <span class="elemental-name">Heart</span>
            <div class="elemental-bar">
              <div class="elemental-fill" style="width: ${codex.composition.noteDistribution.heart}%; background: #f472b6;"></div>
            </div>
            <span class="elemental-value">${Math.round(codex.composition.noteDistribution.heart)}%</span>
          </div>
          <div class="elemental-item">
            <span class="elemental-name">Base</span>
            <div class="elemental-bar">
              <div class="elemental-fill" style="width: ${codex.composition.noteDistribution.base}%; background: #8b5cf6;"></div>
            </div>
            <span class="elemental-value">${Math.round(codex.composition.noteDistribution.base)}%</span>
          </div>
        </div>
        
        <!-- Oils -->
        <div class="card">
          <h3>Oils (${codex.composition.oils.length})</h3>
          ${codex.composition.oils.map(oil => `
            <div class="oil-item">
              <span class="oil-name">${oil.name}</span>
              <span class="oil-meta">${oil.ml}ml <span class="oil-percentage">${Math.round(oil.percentage)}%</span></span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <!-- Component Weave -->
    <div class="section">
      <div class="section-title">Component Weave</div>
      <div class="component-grid">
        <div class="component-card">
          <h4>${codex.crystal.name}</h4>
          <p>${codex.crystal.verb} the blend. Amplifies: ${codex.crystal.amplifies.slice(0, 2).join(', ')}. Shifts frequency by ${codex.crystal.frequencyShift > 0 ? '+' : ''}${codex.crystal.frequencyShift}Hz.</p>
        </div>
        <div class="component-card">
          <h4>${codex.cord.name}</h4>
          <p>${codex.cord.verb}, ${codex.cord.effect}. ${codex.cord.duration}.</p>
        </div>
        <div class="component-card">
          <h4>${codex.carrier.name}</h4>
          <p>${codex.carrier.absorption} absorption. ${codex.carrier.extendsNotes} Feel: ${codex.carrier.feel}.</p>
        </div>
      </div>
    </div>
    
    <!-- Practical Profile -->
    <div class="section">
      <div class="section-title">Therapeutic Profile</div>
      <div class="two-col">
        <div>
          ${topTherapeutic.map(([name, score], i) => `
            <div class="therapeutic-item">
              <div class="therapeutic-header">
                <span class="therapeutic-name" style="${score > 60 ? 'color: #c9a227;' : ''}">${name}</span>
                <span class="therapeutic-value">${score}%</span>
              </div>
              <div class="therapeutic-bar">
                <div class="therapeutic-fill ${score < 60 ? 'low' : ''}" style="width: ${score}%;"></div>
              </div>
            </div>
          `).join('')}
          
          <div class="best-for-tags">
            ${codex.bestFor.map(use => `<span class="tag">${use}</span>`).join('')}
          </div>
        </div>
        
        <div>
          ${codex.applicationMethods.slice(0, 4).map((method, i) => `
            <div class="application-card ${i > 0 ? 'alt' : ''}">
              <div class="application-header">
                <span class="application-name">${method.method}</span>
                <span class="application-match">${method.suitability}% match</span>
              </div>
              <p class="application-instructions">${method.instructions}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <!-- Timing & Safety -->
    <div class="section">
      <div class="section-title">Timing & Safety</div>
      <div class="two-col">
        <div class="info-card">
          <div class="info-item">
            <div class="info-icon" style="background: rgba(251, 191, 36, 0.15);">☀</div>
            <div>
              <div class="info-label">Best Time</div>
              <div class="info-value">${codex.timing.timeOfDay.join(', ')}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon" style="background: rgba(139, 92, 246, 0.15);">🌙</div>
            <div>
              <div class="info-label">Lunar Phase</div>
              <div class="info-value">${codex.timing.lunarPhase}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon" style="background: rgba(16, 185, 129, 0.15);">🌿</div>
            <div>
              <div class="info-label">Season</div>
              <div class="info-value">${codex.timing.season}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon" style="background: rgba(201, 162, 39, 0.15);">✦</div>
            <div>
              <div class="info-label">Peak Maturation</div>
              <div class="info-value">Day ${codex.timing.maturation.peakDay} — ${codex.timing.maturation.shelfLife} shelf life</div>
            </div>
          </div>
        </div>
        
        <div class="info-card safety">
          <div class="safety-badge ${codex.safety.level}">
            ${codex.safety.level === 'safe' ? '✓' : codex.safety.level === 'caution' ? '!' : '⚠'} ${codex.safety.level.charAt(0).toUpperCase() + codex.safety.level.slice(1)}
          </div>
          
          ${!codex.safety.pregnancySafe ? `
            <div class="caution-item">
              <span class="caution-icon">!</span>
              <span>Not recommended during pregnancy</span>
            </div>
          ` : ''}
          
          ${codex.safety.ageRestriction ? `
            <div class="caution-item">
              <span class="caution-icon">!</span>
              <span>Age restriction: ${codex.safety.ageRestriction}</span>
            </div>
          ` : ''}
          
          ${codex.safety.contraindications.map(caution => `
            <div class="caution-item">
              <span class="caution-icon">!</span>
              <span>${caution}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <!-- The Ritual -->
    <div class="section">
      <div class="section-title">The Ritual</div>
      <div class="ritual-card">
        <div class="ritual-section">
          <div class="ritual-label">Intention Setting</div>
          <p class="ritual-intention">"${codex.ritual.intention}."</p>
        </div>
        <div class="ritual-section">
          <div class="ritual-label">Application</div>
          <p class="ritual-text">${codex.ritual.application}</p>
        </div>
        <div class="ritual-section">
          <div class="ritual-label">Storage</div>
          <p class="ritual-text">${codex.ritual.storage}</p>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">Oil Amor</div>
      <div class="footer-tagline">Living Blend Codex • Generated ${new Date().toLocaleDateString()}</div>
    </div>
  </div>
</body>
</html>
  `
}
